import React, { useState, useEffect, useContext, useCallback } from 'react';
import Loading from '../components/Loading';
import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';
import ChangesList from '../components/ChangesList';
import Message from '../components/Message';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import AffectedList from '../components/AffectedLIst';

const AllAffected = () => {
	// const [changes, setChanges] = useState([]);
	// const [loading, setLoading] = useState(true);
	// const [error, setError] = useState();
	// const { httpRequestHandler } = useHttpConnection();

	// const context = useContext(UserContext);
	// const navigate = useNavigate();

	// const fetchAllAffected = useCallback(async () => {
	// 	try {
	// 		let consult = await httpRequestHandler(
	// 			'http://localhost:5000/api/changes/all',
	// 			'POST',
	// 			{},
	// 			{
	// 				authorization: `Bearer ${context.token}`,
	// 			},
	// 		);
	// 		setLoading(false);
	// 		setChanges(consult);
	// 		return consult;
	// 	} catch (error) {
	// 		setError(true);
	// 		console.log(error);
	// 	}
	// }, [httpRequestHandler, context]);

	// useEffect(() => {
	// 	fetchAllAffected();
	// 	return () => {
	// 		setChanges([]);
	// 	};
	// }, [fetchAllAffected]);

	return <AffectedList />;
	// error ? (
	// 	<Message
	// 		titulo="Error carganado datos"
	// 		icono={<FaExclamationTriangle />}
	// 		cuerpo="No se pudieron cargar datos de personal afectado y desafectado. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
	// 		textoBoton="VOLVER"
	// 		onClick={() => navigate('/')}
	// 	/>
	// ) : loading ? (
	// 	<Loading />
	// ) : (
	// );
};

export default AllAffected;
