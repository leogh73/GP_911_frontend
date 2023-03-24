import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserCircle, FaUserLock, FaUserTimes } from 'react-icons/fa';

const Password = ({ type }) => {
	const [success, setSuccess] = useState();
	const [error, setError] = useState();
	const navigate = useNavigate();

	const processResult = (result) => {
		result.result._id ? setSuccess(true) : setError(true);
	};

	const goBack = () => {
		setError(false);
		setSuccess(false);
		navigate('/');
	};

	return error ? (
		<div className="new-form">
			<Message
				title={type === 'change' ? 'Cambio fallido' : 'Recuperación fallida'}
				icon={<FaUserTimes />}
				body={`No se pudo completar el proceso de ${
					type === 'change' ? 'cambio de contraseña.' : 'recuperación contraseña. '
				} Intente nuevamente más tarde. Si el problema persiste,o cntacte al administrador. Disculpe las molestias ocasionadas.`}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : success ? (
		<div className="new-form">
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
		</div>
	) : (
		<Form
			sendUserForm={processResult}
			formTitle={type === 'change' ? 'Cambio de contraseña' : 'Recuperación de contraseña'}
			icon={<FaUserLock />}
			rememberMe=""
			buttonText="ENVIAR"
			pageName={type === 'change' ? 'change-password' : 'forgot-password'}
			footer={
				type === 'forgot' ? (
					<div className="form-footer">
						<div className="separator" />
						<Link className="text-center" to="/">
							Volver
						</Link>
					</div>
				) : null
			}
		/>
	);
};

export default Password;
