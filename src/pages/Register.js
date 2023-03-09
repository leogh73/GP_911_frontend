import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserCircle, FaUserPlus, FaUserTimes } from 'react-icons/fa';

const Register = ({ section }) => {
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
			title="Registro fallido"
			icon={<FaUserTimes />}
			body="No se pudo completar el proceso de registro. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
			buttonText="VOLVER"
			onClick={goBack}
		/>
	) : success ? (
		<Message
			title="Registro exitoso"
			icon={<FaUserCheck />}
			body="Nuevo usuario registrado exitosamente."
			buttonText="VOLVER"
			onClick={goBack}
		/>
	) : (
		<Form
			sendUserForm={registerResult}
			formTitle="Registro de usuario"
			icon={<FaUserPlus />}
			rememberMe=""
			buttonText="REGISTRAR"
			pageName="register"
			section={section}
		/>
	);
};

export default Register;
