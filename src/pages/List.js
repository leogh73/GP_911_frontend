import React, { useState, useEffect, useContext, useCallback } from 'react';
import Loading from '../components/Loading';
import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';
import Message from '../components/Message';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import ItemsList from '../components/ItemsList.js';

const List = ({ type }) => {
	const [items, setItems] = useState();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const { httpRequestHandler } = useHttpConnection();
	const context = useContext(UserContext);
	const navigate = useNavigate();

	const fetchListItems = useCallback(async () => {
		try {
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/list/all',
				'POST',
				JSON.stringify({ type: type }),
				{ authorization: `Bearer ${context.token}`, 'Content-type': 'application/json' },
			);
			setItems(consult);
			setLoading(false);
		} catch (error) {
			setError(true);
			console.log(error);
		}
	}, [httpRequestHandler, type, context]);

	useEffect(() => {
		fetchListItems();
		return () => {
			setItems(null);
		};
	}, [fetchListItems]);

	return error ? (
		<Message
			title="Error cargando cambios"
			icon={<FaExclamationTriangle />}
			body="No se pudieron cargar cambios de guardia. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
			buttonText="VOLVER"
			onClick={() => navigate('/')}
		/>
	) : loading ? (
		<Loading type={'closed'} />
	) : (
		<ItemsList type={type} items={items} />
	);
};

export default List;
