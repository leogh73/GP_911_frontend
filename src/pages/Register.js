import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserCircle, FaUserTimes } from 'react-icons/fa';

const Register = () => {
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
			titulo="Registro exitoso"
			icon={<FaUserCheck />}
			body="Nuevo usuario registrado exitosamente."
			buttonText="VOLVER"
			onClick={goBack}
		/>
	) : (
		<Form
			sendUserForm={registerResult}
			title="Registro de usuario"
			icon={<FaUserCircle />}
			rememberMe=""
			buttonText="REGISTRARME"
			pageName="register"
			footer={
				<div>
					<hr className="my-4" />
					<p className="text-center">
						¿Ya es usuario? <Link to="/iniciarsesion">Iniciar sesión</Link>
					</p>
				</div>
			}
		/>
	);
};

export default Register;
