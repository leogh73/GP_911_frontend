import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserCircle, FaUserLock, FaUserTimes } from 'react-icons/fa';

const Password = ({ type }) => {
	const [success, setSuccess] = useState();
	const [error, setError] = useState();

	const registerResult = (result) => {
		result.userId ? setSuccess(true) : setError(true);
	};

	const goBack = () => {
		setError(false);
		setSuccess(false);
	};

	return error ? (
		<Message
			title={type === 'change' ? 'Cambio fallido' : 'Recuperación fallida'}
			icon={<FaUserTimes />}
			body={`No se pudo completar el proceso de ${
				type === 'change' ? 'cambio de contraseña.' : 'recuperación contraseña. '
			} Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas.`}
			buttonText="VOLVER"
			onClick={goBack}
		/>
	) : success ? (
		<Message
			title={type === 'change' ? 'Cambio correcto' : 'Solicitud correcta'}
			icon={<FaUserCheck />}
			body={
				type === 'change'
					? 'Contraseña cambiada correctamente.'
					: 'Se completó correctamente el pedido de recuperación de contraseña. Verifique su correo electrónico y siga las instrucciones.'
			}
			buttonText="VOLVER"
			onClick={goBack}
		/>
	) : (
		<Form
			sendUserForm={registerResult}
			formTitle={type === 'change' ? 'Cambio de contraseña' : 'Recuperación de contraseña'}
			icon={<FaUserLock />}
			rememberMe=""
			buttonText="ENVIAR"
			pageName={type === 'change' ? 'change-password' : 'forgot-password'}
		/>
	);
};

export default Password;
