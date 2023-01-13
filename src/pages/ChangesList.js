import React, { useState, useCallback, useEffect, useContext } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';
import Table from '../components/Table';

import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';

const ChangesList = () => {
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
				JSON.stringify({ type: location.pathname === '/changes/agreed' ? 'change' : 'request' }),
				{ authorization: `Bearer ${context.token}`, 'Content-type': 'application/json' },
			);
			console.log(consult);
			setDataList(consult);
		} catch (error) {
			setError(true);
			console.log(error.toString());
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, location.pathname, context]);

	useEffect(() => {
		fetchListItems();
	}, [fetchListItems]);

	return (
		<div className={error || loading ? 'center-content' : ''}>
			{error ? (
				<Message
					title="Error cargando cambios"
					icon={<FaExclamationTriangle />}
					body="No se pudieron cargar cambios de guardia. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
				/>
			) : loading ? (
				<Loading type={'closed'} />
			) : location.pathname === '/changes/requested' ? (
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
	);
};

export default ChangesList;
