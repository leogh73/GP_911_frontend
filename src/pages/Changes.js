import React, { useState, useCallback, useEffect, useContext } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';
import Table from '../components/Table';

import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';

import './Changes.css';

const Changes = () => {
	const [showRequested, setShowRequested] = useState(false);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [dataList, setDataList] = useState();

	const { httpRequestHandler } = useHttpConnection();
	const context = useContext(UserContext);
	const navigate = useNavigate();

	const fetchListItems = useCallback(async () => {
		try {
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/list/all',
				'POST',
				JSON.stringify({ type: showRequested ? 'request' : 'change' }),
				{ authorization: `Bearer ${context.token}`, 'Content-type': 'application/json' },
			);
			setDataList(consult);
		} catch (error) {
			setError(true);
			console.log(error.toString());
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, showRequested, context]);

	useEffect(() => {
		fetchListItems();
	}, [fetchListItems, showRequested]);

	const tabClickHandler = (e) => {
		let element = document.getElementById(e.target.id);
		if (element) {
			// let index = element.getAttribute('index');
			let tabs = document.querySelectorAll('.tab');
			// let contents = document.querySelectorAll('.changes');
			tabs.forEach((tab) => tab.classList.remove('selected'));
			// contents.forEach((content) => {
			// 	content.classList.remove('show');
			// });
			element.classList.add('selected');
			// contents[index].classList.add('show');
			setError(false);
			setLoading(true);
			setShowRequested(!showRequested);
		}
	};

	return (
		<div className="changes-list">
			<div className="tabs-container" onClick={tabClickHandler}>
				<div className="tabs-list">
					<div className="tab selected" id="requested" index={0}>
						Acordados
					</div>
					<div className="tab" id="opened" index={1}>
						Solicitados
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
				) : showRequested ? (
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
