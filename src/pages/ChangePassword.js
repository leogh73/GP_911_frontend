import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserCircle, FaUserLock, FaUserTimes } from 'react-icons/fa';

const ChangePassword = () => {
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
			title="Cambio fallido"
			icon={<FaUserTimes />}
			body="No se pudo completar el proceso de cambio de contraseña. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
			buttonText="VOLVER"
			onClick={goBack}
		/>
	) : success ? (
		<Message
			title="Cambio correcto"
			icon={<FaUserCheck />}
			body="Contraseña cambiada correctamente."
			buttonText="VOLVER"
			onClick={goBack}
		/>
	) : (
		<Form
			sendUserForm={registerResult}
			formTitle="Cambio de contraseña"
			icon={<FaUserLock />}
			rememberMe=""
			buttonText="ENVIAR"
			pageName="change-password"
		/>
	);
};

export default ChangePassword;
