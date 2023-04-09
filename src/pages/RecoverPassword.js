import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserLock, FaUserTimes } from 'react-icons/fa';

import 'react-calendar/dist/Calendar.css';

import Loading from '../components/Loading';
import useHttpConnection from '../hooks/useHttpConnection';

const RecoverPassword = () => {
	const [isLoggedInIsValid, setTokenIsValid] = useState();
	const [errorPassword, setErrorPassword] = useState();
	const [successPassword, setSuccessPassword] = useState();
	const { httpRequestHandler } = useHttpConnection();
	const [userId, setUserId] = useState();
	const [loadingForm, setLoadingForm] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();
	const token = location.pathname.split('/token=')[1];

	const checkToken = useCallback(async () => {
		try {
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/user/forgot-password',
				'POST',
				JSON.stringify({ token }),
				{ 'Content-type': 'application/json' },
			);
			if (consult.error) return setTokenIsValid(false);
			setTokenIsValid(true);
			setUserId(consult._id);
		} catch (error) {
			setTokenIsValid(false);
		} finally {
			setLoadingForm(false);
		}
	}, [httpRequestHandler, token]);

	const processResult = (result) => {
		result.result._id ? setSuccessPassword(true) : setErrorPassword(true);
	};

	useEffect(() => {
		checkToken();
		return () => {
			setLoadingForm(true);
			setSuccessPassword(null);
			setErrorPassword(null);
		};
	}, [checkToken]);

	const goBack = () => navigate('/');

	return loadingForm ? (
		<div className="spinner-container-change">
			<Loading type={'closed'} />
		</div>
	) : !isLoggedInIsValid ? (
		<div className="new-form">
			<Message
				title={'Acceso incorrecto'}
				icon={<FaUserCheck />}
				body={'Los datos de solicitud son inválidos.'}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : errorPassword ? (
		<div className="new-form">
			<Message
				title={'Cambio de contraseña fallido'}
				icon={<FaUserTimes />}
				body={`No se pudo completar el proceso de cambio de contraseña.`}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : successPassword ? (
		<div className="new-form">
			<Message
				title={'Nueva contraseña establecida correctamente.'}
				icon={<FaUserCheck />}
				body={
					'Se completó correctamente la recuperación de contraseña. Ya puede iniciar sesión con su nueva contraseña.'
				}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : (
		<Form
			sendUserForm={processResult}
			formTitle={'Nueva contraseña'}
			icon={<FaUserLock />}
			rememberMe=""
			buttonText="ENVIAR"
			pageName={'new-password'}
			userId={userId}
			footer={
				<>
					<div className="form-footer">
						<div className="separator" />
						<Link className="text-center" to="/">
							Volver
						</Link>
					</div>
				</>
			}
		/>
	);
};

export default RecoverPassword;
