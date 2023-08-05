import React, { useState, useCallback, useEffect, useContext } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';
import Table from '../components/Table';
import UserContext from '../context/UserContext';

import './Changes.css';
import useHttpConnection from '../hooks/useHttpConnection';
import ItemShared from '../components/ItemShared';

const Shared = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [itemData, setItemData] = useState({});
	const { httpRequestHandler } = useHttpConnection();
	const userContext = useContext(UserContext);

	const routeParams = useParams();
	const type = routeParams.type;
	const id = routeParams.id;

	const fetchData = useCallback(async () => {
		try {
			let data = await httpRequestHandler(
				`${process.env.REACT_APP_API_URL}/api/item/fetch/${type}/${id}`,
			);
			console.log(data);
			if (data.error) setError(true);
			setItemData(data);
		} catch (error) {
			console.log(error);
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, id, type]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<div className="changes-list">
			{error ? (
				<div className="loading-error-change" style={{ paddingBottom: '3em' }}>
					<Message
						title={'Error cargando datos'}
						icon={<FaExclamationTriangle />}
						body={
							'No se pudieron cargar los datos solicitados. Verifique su conexión o reintente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas.'
						}
					/>
				</div>
			) : loading ? (
				<div className="spinner-container-change">
					<Loading type={'closed'} />
				</div>
			) : (
				<ItemShared type={type} data={itemData} />
			)}
		</div>
	);
};

export default Shared;
