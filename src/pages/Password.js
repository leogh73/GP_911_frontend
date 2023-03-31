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

	let formData;
	if (type === 'change') {
		formData = { title: 'Cambio de contraseña', pageName: 'change-password', footer: null };
	}
	if (type === 'forgot') {
		formData = {
			title: 'Recuperación de contraseña',
			pageName: 'forgot-password',
			footer: (
				<>
					(
					<div className="form-footer">
						<div className="separator" />
						<Link className="text-center" to="/">
							Volver
						</Link>
					</div>
					)
				</>
			),
		};
	}
	if (type === 'new') {
		formData = { title: 'Nueva contraseña', pageName: 'new-password', footer: null };
	}

	let errorMessage;
	if (type === 'change') {
		errorMessage = {
			title: 'Cambio fallido',
			body: 'No se pudo completar el proceso de cambio de contraseña.',
		};
	}
	if (type === 'forgot') {
		errorMessage = {
			title: 'Recuperación fallida',
			body: 'No se pudo completar el proceso de recuperación de contraseña.',
		};
	}
	if (type === 'new') {
		errorMessage = {
			title: 'Modificación fallida',
			body: 'No se pudo completar el proceso de modificación de contraseña. Reintente más tarde',
		};
	}

	let successMessage;
	if (type === 'change') {
		successMessage = {
			title: 'Contraseña cambiada correctamente',
			body: 'No se pudo completar el proceso de cambio de contraseña.',
		};
	}
	if (type === 'forgot') {
		successMessage = {
			title: 'Solicitud correcta',
			body: 'Se completó correctamente el pedido de recuperación de contraseña. Verifique su correo electrónico y siga las instrucciones.',
		};
	}
	if (type === 'new') {
		successMessage = {
			title: 'Recuperación de contraseña correcta',
			body: 'Ya puede iniciar sesión con su nueva contraseña.',
		};
	}

	return error ? (
		<div className="new-form">
			<Message
				title={errorMessage.title}
				icon={<FaUserTimes />}
				body={`${errorMessage.body} Intente nuevamente más tarde. Si el problema persiste,o cntacte al administrador. Disculpe las molestias ocasionadas.`}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : success ? (
		<div className="new-form">
			<Message
				title={successMessage.title}
				icon={<FaUserCheck />}
				body={successMessage.body}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : (
		<Form
			sendUserForm={processResult}
			formTitle={formData.title}
			icon={<FaUserLock />}
			rememberMe=""
			buttonText="ENVIAR"
			pageName={formData.pageName}
			footer={formData.footer}
		/>
	);
};

export default Password;
