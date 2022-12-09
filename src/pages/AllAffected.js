import React, { useState, useEffect, useContext, useCallback } from 'react';
import Loading from '../components/Loading';
import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';
import Message from '../components/Message';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import Table from '../components/Table';
import '../components/ChangesList.css';

const AllAffected = () => {
	const [changes, setChanges] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const { httpRequestHandler } = useHttpConnection();

	const context = useContext(UserContext);
	const navigate = useNavigate();

	const fetchAllChanges = useCallback(async () => {
		try {
			// let consult = await httpRequestHandler(
			// 	'http://localhost:5000/api/changes/all',
			// 	'POST',
			// 	{},
			// 	{
			// 		authorization: `Bearer ${context.token}`,
			// 	},
			// );

			// setLoading(true);
			const changes = [
				{
					priorityId: '001',
					name: 'Cuevas Leonardo',
					affectedData: {
						date: '01/12/2022',
						shift: '14 a 22 hs.',
						day: 'Viernes',
						guardId: 'F',
					},
					disaffectedData: {
						date: '08/12/2022',
						shift: '14 a 22 hs.',
						day: 'Miercoles',
						guardId: 'B',
					},
					bookPage: '114',
				},
				{
					priorityId: '002',
					name: 'Coccolo Silvana',
					affectedData: {
						date: '09/12/2022',
						shift: '14 a 22 hs.',
						day: 'Viernes',
						guardId: 'F',
					},

					disaffectedData: {
						date: '14/12/2022',
						shift: '14 a 22 hs.',
						day: 'Miercoles',
						guardId: 'B',
					},
					bookPage: '117',
				},
				{
					priorityId: '003',
					name: 'Da Costa melina',
					affectedData: {
						date: '29/11/2022',
						shift: '14 a 22 hs.',
						day: 'Viernes',
						guardId: 'F',
					},
					disaffectedData: {
						date: '30/11/2022',
						shift: '14 a 22 hs.',
						day: 'Miercoles',
						guardId: 'B',
					},
					bookPage: '110',
				},
			];
			setChanges(changes);
			setLoading(false);
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
			titulo="Error cargando cambios"
			icono={<FaExclamationTriangle />}
			cuerpo="No se pudieron cargar cambios de guardia. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
			textoBoton="VOLVER"
			onClick={() => navigate('/')}
		/>
	) : loading ? (
		<Loading />
	) : (
		<div className="changes-list">
			<div className="changes show">
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
					dataList={changes}
					newLink={'/newaffected'}
				/>
			</div>
		</div>
	);
};

export default AllAffected;

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
