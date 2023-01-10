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
				JSON.stringify({ type: 'affected' }),
				{ authorization: `Bearer ${context.token}`, 'Content-type': 'application/json' },
			);
			setDataList(consult);
		} catch (error) {
			setError(true);
			console.log(error.toString());
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, context]);

	useEffect(() => {
		fetchListItems();
	}, [fetchListItems]);

	return (
		<div className="changes-list">
			<div className={error || loading ? 'center-content' : ''}>
				{error ? (
					<Message
						title="Error cargando cambios"
						icon={<FaExclamationTriangle />}
						body="No se pudieron cargar cambios de guardia. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
					/>
				) : loading ? (
					<Loading type={'closed'} />
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
		</div>
	);
};

export default Affected;
