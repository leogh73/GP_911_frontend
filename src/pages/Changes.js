import React, { useState, useCallback, useEffect, useContext } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';
import Table from '../components/Table';

import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';

import './Changes.css';

const Changes = ({ type }) => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [dataList, setDataList] = useState();

	const { httpRequestHandler } = useHttpConnection();
	const context = useContext(UserContext);
	const navigate = useNavigate();
	const location = useLocation();

	const fetchListItems = useCallback(async () => {
		try {
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/list/all',
				'POST',
				JSON.stringify({ type }),
				{ authorization: `Bearer ${context.token}`, 'Content-type': 'application/json' },
			);
			setDataList(consult);
		} catch (error) {
			setError(true);
			console.log(error.toString());
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, type, context]);

	useEffect(() => {
		fetchListItems();
	}, [fetchListItems]);

	useEffect(() => {
		let tabs = document.querySelectorAll('.tab');
		let element = document.getElementById(location.pathname);
		tabs.forEach((tab) => tab.classList.remove('selected'));
		if (!element.classList.contains('selected')) element.classList.add('selected');
		context.loadActiveTab(location.pathname);
	}, [location.pathname, context]);

	const tabClickHandler = (e) => {
		let elementId = e.target.getAttribute('id');
		let elementUrl = e.target.getAttribute('href');
		let url = !!elementId ? elementId : elementUrl;
		if (!!url && url !== location.pathname) {
			navigate(url);
			context.loadActiveTab(url);
			setError(false);
			setLoading(true);
		}
	};

	const agreedId = '/changes/agreed';
	const requestedId = '/changes/requested';

	return (
		<div className="changes-list">
			<div className="tabs-container" onClick={tabClickHandler}>
				<div className="tabs-list">
					<div className="tab" id={agreedId} index={0}>
						<Link to={agreedId}>Acordados</Link>
					</div>
					<div className="tab" id={requestedId} index={1}>
						<Link to={requestedId}>Solicitados</Link>
					</div>
				</div>
			</div>
			<div className={error || loading ? 'center-content' : ''}>
				{error ? (
					<Message
						title="Error cargando cambios"
						icon={<FaExclamationTriangle />}
						body="No se pudieron cargar cambios de guardia. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
					/>
				) : loading ? (
					<Loading type={'closed'} />
				) : context.activeTab === '/changes/requested' ? (
					<Table
						id={Math.random() * 10000}
						headersList={[
							{ key: 0, title: '#' },
							{ key: 1, title: 'Personal' },
							{ key: 2, title: 'Pedido' },
							{ key: 3, title: 'Ofrecido' },
						]}
						rowType={'request'}
						dataList={dataList}
						newLink={'/newrequest'}
					/>
				) : (
					<Table
						id={Math.random() * 10000}
						headersList={[
							{ key: 0, title: '#' },
							{ key: 1, title: 'Quien cubre' },
							{ key: 2, title: 'A cubrir' },
							{ key: 3, title: 'Quien devuelve' },
							{ key: 4, title: 'A devolver' },
							{ key: 5, title: 'Estado' },
						]}
						rowType={'change'}
						dataList={dataList}
						newLink={'/newchange'}
					/>
				)}
			</div>
		</div>
	);
};

export default Changes;
