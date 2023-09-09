import React, { useState, useCallback, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';

import './Changes.css';
import useHttpConnection from '../hooks/useHttpConnection';
import ItemShared from '../components/ItemShared';

const Shared = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [itemData, setItemData] = useState({});
	const { httpRequestHandler } = useHttpConnection();

	const routeParams = useParams();
	const type = routeParams.type;
	const id = routeParams.id;

	const fetchData = useCallback(async () => {
		try {
			let data = await httpRequestHandler(`item/fetch/${type}/${id}`);
			if (data.error) return setError(true);
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
		<div>
			{error ? (
				<div className="new-form">
					<Message
						title={'Error cargando datos'}
						icon={<FaExclamationTriangle />}
						body={
							'No se pudieron cargar los datos solicitados. Verifique su conexión o reintente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas.'
						}
					/>
				</div>
			) : loading ? (
				<div className="spinner-container-shared" style={{ marginTop: '3.9em' }}>
					<Loading type={'closed'} />
				</div>
			) : (
				<ItemShared type={type} data={itemData} />
			)}
		</div>
	);
};

export default Shared;
