import React, { useState, useCallback, useEffect, useContext } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';
import Table from '../components/Table';

import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';

import './Changes.css';

const Affected = () => {
	const { httpRequestHandler } = useHttpConnection();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [dataList, setDataList] = useState();
	const context = useContext(UserContext);

	const fetchListItems = useCallback(async () => {
		try {
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/item/all',
				'POST',
				JSON.stringify({ type: 'affected' }),
				{ authorization: `Bearer ${context.token}`, 'Content-type': 'application/json' },
			);
			if (consult.error) return setError(true);
			setDataList(consult);
		} catch (error) {
			console.log(error);
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, context]);

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
						{ key: 1, title: 'Personal' },
						{ key: 2, title: 'Afectado' },
						{ key: 3, title: 'Desafectado' },
						{ key: 4, title: 'Foja' },
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
