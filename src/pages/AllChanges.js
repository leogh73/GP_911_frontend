import React, { useState, useEffect, useContext, useCallback } from 'react';
import Loading from '../components/Loading';
import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';
import Message from '../components/Message';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import ChangesList from '../components/ChangesList.js';

const AllChanges = () => {
	const [changes, setChanges] = useState([]);
	const [loading, setLoading] = useState();
	const [error, setError] = useState();
	const { httpRequestHandler } = useHttpConnection();

	const context = useContext(UserContext);
	const navigate = useNavigate();

	const fetchAllChanges = useCallback(async () => {
		try {
			setLoading(true);
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/changes/all',
				'POST',
				{},
				{
					authorization: `Bearer ${context.token}`,
				},
			);
			setLoading(false);
			setChanges(consult);
		} catch (error) {
			setError(true);
			console.log(error);
		}
	}, [httpRequestHandler, context]);

	useEffect(() => {
		fetchAllChanges();
		return () => {
			setChanges([]);
		};
	}, [fetchAllChanges]);

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
		<ChangesList changes={changes} />
	);
};

export default AllChanges;
