import React, { useState, useCallback, useEffect, useContext } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';
import Table from '../components/Table';
import UserContext from '../context/UserContext';

import './Changes.css';
import useHttpConnection from '../hooks/useHttpConnection';

const Changes = ({ type }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [dataList, setDataList] = useState();
	const { httpRequestHandler } = useHttpConnection();
	const userContext = useContext(UserContext);
	const navigate = useNavigate();
	const location = useLocation();

	const fetchListItems = useCallback(async () => {
		try {
			let consult = await httpRequestHandler('item/all', 'POST', JSON.stringify({ type }), {
				authorization: `Bearer ${userContext.token}`,
				'Content-type': 'application/json',
			});
			if (consult.error) {
				setError(true);
				if (consult.error === 'Not authorized') {
					userContext.logout(true);
				}
				return;
			}
			setDataList(consult.result);
			if (consult.newAccessToken) {
				const newUserData = { ...userContext.userData, token: consult.newAccessToken };
				userContext.login(newUserData);
			}
		} catch (error) {
			console.log(error);
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, type, userContext]);

	useEffect(() => {
		fetchListItems();
	}, [fetchListItems]);

	useEffect(() => {
		let tabs = document.querySelectorAll('.tab');
		let element = document.getElementById(location.pathname);
		tabs.forEach((tab) => tab.classList.remove('selected'));
		if (!element.classList.contains('selected')) element.classList.add('selected');
	}, [location.pathname]);

	const tabClickHandler = (e) => {
		let elementId = e.target.getAttribute('id');
		let elementUrl = e.target.getAttribute('href');
		let url = !!elementId ? elementId : elementUrl;
		if (!!url && url !== location.pathname) {
			navigate(url);
			setDataList(null);
			setLoading(true);
			setError(false);
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
			{error ? (
				<div className="loading-error-change">
					<Message
						title={`Error cargando ${
							userContext.state.activeTab === '/changes/agreed' ? 'cambios' : 'pedidos'
						}`}
						icon={<FaExclamationTriangle />}
						body={`No se pudieron cargar ${
							userContext.state.activeTab === '/changes/agreed' ? 'cambios de guardia' : 'pedidos'
						}. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas.`}
					/>
				</div>
			) : loading ? (
				<div className="spinner-container-change">
					<Loading type={'closed'} />
				</div>
			) : type === 'request' ? (
				<Table
					id={Math.random() * 10000}
					headersList={[
						{ key: 0, title: '#' },
						{ key: 1, title: 'Personal' },
						{ key: 2, title: 'Pedido' },
						{ key: 3, title: 'Ofrecido' },
						{ key: 4, title: 'Comentario' },
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
	);
};

export default Changes;
