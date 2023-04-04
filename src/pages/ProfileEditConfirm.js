import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import { FaUserCheck, FaUserTimes } from 'react-icons/fa';

import 'react-calendar/dist/Calendar.css';

import useHttpConnection from '../hooks/useHttpConnection';
import UserContext from '../context/UserContext';
import Loading from '../components/Loading';

const ProfileEditConfirm = () => {
	const { httpRequestHandler } = useHttpConnection();
	const [success, setSuccess] = useState();
	const [loading, setLoading] = useState(true);
	const [result, setResult] = useState();
	const userContext = useContext(UserContext);
	const navigate = useNavigate();
	const location = useLocation();
	const isLoggedInData = location.pathname.split('/isLoggedIn=')[1];

	const confirmProfileChange = useCallback(async () => {
		try {
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/user/profile-edit',
				'POST',
				JSON.stringify({ changeToken: isLoggedInData }),
				{ authorization: `Bearer ${userContext.isLoggedIn}`, 'Content-type': 'application/json' },
			);
			if (consult.error) return setSuccess(false);
			setResult(consult.result);
			setSuccess(true);
		} catch (error) {
			console.log(error);
			setSuccess(false);
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, isLoggedInData, userContext.isLoggedIn]);

	useEffect(() => {
		confirmProfileChange();
		return () => setLoading(true);
	}, [confirmProfileChange]);

	const goBack = () => {
		if (success) {
			result.isLoggedIn = userContext.userData.isLoggedIn;
			result.userId = result._id;
			userContext.login(result);
		}
		navigate('/profile');
	};

	return loading ? (
		<div className="spinner-container-change">
			<Loading type={'closed'} />
		</div>
	) : success ? (
		<div className="new-form">
			<Message
				title={'Cambio confirmado'}
				icon={<FaUserCheck />}
				body={'Se han modificado correctamente los datos de su perfil.'}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : (
		<div className="new-form">
			<Message
				title={'Solicitud fallida'}
				icon={<FaUserTimes />}
				body={
					'No se pudieron editar sus datos de perfil. Reintente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas.'
				}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	);
};

export default ProfileEditConfirm;
