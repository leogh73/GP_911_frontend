import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import { FaUserCheck, FaUserTimes } from 'react-icons/fa';

import 'react-calendar/dist/Calendar.css';

import UserContext from '../context/UserContext';

import Loading from '../components/Loading';
import useHttpConnection from '../hooks/useHttpConnection';

const ProfileEditConfirm = () => {
	const [success, setSuccess] = useState();
	const [loading, setLoading] = useState(true);
	const [result, setResult] = useState();
	const { httpRequestHandler } = useHttpConnection();
	const userContext = useContext(UserContext);
	const navigate = useNavigate();
	const location = useLocation();
	const tokenData = location.pathname.split('/token=')[1];

	const confirmProfileChange = useCallback(async () => {
		try {
			let consult = await httpRequestHandler(
				`${process.env.REACT_APP_API_URL}/api/user/profile-edit`,
				'POST',
				JSON.stringify({ changeToken: tokenData }),
				{
					authorization: `Bearer ${userContext.token}`,
					'Content-type': 'application/json',
				},
			);
			if (consult.error) return setSuccess(false);
			setResult(consult.result);
			setSuccess(true);
			if (consult.newAccessToken) {
				const newUserData = { ...userContext.userData, token: consult.newAccessToken };
				userContext.login(newUserData);
			}
		} catch (error) {
			console.log(error);
			setSuccess(false);
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, tokenData, userContext]);

	useEffect(() => {
		confirmProfileChange();
		return () => setLoading(true);
	}, [confirmProfileChange]);

	const goBack = () => {
		if (success) {
			result.isLoggedIn = userContext.token;
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
