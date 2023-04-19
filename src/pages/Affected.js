import React, { useState, useCallback, useEffect, useContext } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';
import Table from '../components/Table';

import useHttpConnection from '../hooks/useHttpConnection';

import UserContext from '../context/UserContext';

import '../pages/Changes';

const Affected = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [dataList, setDataList] = useState();
	const { httpRequestHandler } = useHttpConnection();
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	const fetchListItems = useCallback(async () => {
		try {
			let consult = await httpRequestHandler(
				`${process.env.REACT_APP_API_URL}/api/item/all`,
				'POST',
				JSON.stringify({ type: 'affected' }),
				{
					authorization: `Bearer ${userContext.token}`,
					'Content-type': 'application/json',
				},
			);
			if (consult.error) {
				setError(true);
				if (consult.error === 'Token expired') {
					userContext.logout(true);
					navigate('/');
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
	}, [httpRequestHandler, userContext, navigate]);

	useEffect(() => {
		fetchListItems();
	}, [fetchListItems]);

	return (
		<div className="changes-list">
			{error ? (
				<div className="spinner-container-affected">
					<Message
						title="Error cargando cambios"
						icon={<FaExclamationTriangle />}
						body="No se pudieron cargar datos de personal afectado y desafectado. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
					/>
				</div>
			) : loading ? (
				<div className="spinner-container-affected">
					<Loading type={'closed'} />
				</div>
			) : (
				<Table
					id={Math.random() * 10000}
					headersList={[
						{ key: 0, title: '#' },
						{ key: 1, title: 'Superior' },
						{ key: 2, title: 'Personal' },
						{ key: 3, title: 'Afectado' },
						{ key: 4, title: 'Desafectado' },
						{ key: 5, title: 'Comentario' },
						{ key: 6, title: 'Foja' },
					]}
					rowType={'affected'}
					dataList={dataList}
					newLink={'/newaffected'}
				/>
			)}
		</div>
	);
};

export default Affected;
