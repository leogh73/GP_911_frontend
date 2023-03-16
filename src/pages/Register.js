import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserCircle, FaUserPlus, FaUserTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';

const Register = ({ section }) => {
	const navigate = useNavigate();
	const userContext = useContext(UserContext);

	const registerResult = (result) => {
		navigate(`/users/${section.toLowerCase()}`);
		result.userId
			? toast('Personal registrado correctamente.', { type: 'success' })
			: toast('No se pudo completar el proceso de registro.', { type: 'error' });
	};

	// const goBack = () => {
	// 	setError(false);
	// 	setSuccess(false);
	// };

	return (
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
	// error ? (
	// 	<Message
	// 		title="Registro fallido"
	// 		icon={<FaUserTimes />}
	// 		body="No se pudo completar el proceso de registro. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
	// 		buttonText="VOLVER"
	// 		onClick={goBack}
	// 	/>
	// ) : success ? (
	// 	<Message
	// 		title="Registro exitoso"
	// 		icon={<FaUserCheck />}
	// 		body="Nuevo usuario registrado exitosamente."
	// 		buttonText="VOLVER"
	// 		onClick={goBack}
	// 	/>
	// ) : (
	// 	<Form
	// 		sendUserForm={registerResult}
	// 		formTitle="Registro de usuario"
	// 		icon={<FaUserPlus />}
	// 		rememberMe=""
	// 		buttonText="REGISTRAR"
	// 		pageName="register"
	// 		section={section}
	// 	/>
	// );
};

export default Register;
