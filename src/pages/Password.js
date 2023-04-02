import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserCircle, FaUserLock, FaUserTimes } from 'react-icons/fa';
import Modal from '../components/Modal';

const Password = ({ type }) => {
	const [success, setSuccess] = useState();
	const [error, setError] = useState();
	const [emailIsValid, setEmailIsValid] = useState(false);
	const navigate = useNavigate();

	const processResult = (result) => {
		if (result.error === 'User not found') return setEmailIsValid(true);
		result._id ? setSuccess(true) : setError(true);
	};

	const goBack = () => {
		setError(false);
		setSuccess(false);
		setEmailIsValid(false);
		navigate('/');
	};

	return error ? (
		<div className="new-form">
			<Message
				title={type === 'change' ? 'Cambio fallido' : 'Recuperación fallida'}
				icon={<FaUserTimes />}
				body={`No se pudo completar el proceso de ${
					type === 'change' ? 'cambio' : 'recuperación'
				} de contraseña.`}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : success ? (
		<div className="new-form">
			<Message
				title={type === 'change' ? 'Contraseña cambiada correctamente.' : 'Solicitud correcta'}
				icon={<FaUserCheck />}
				body={
					type === 'change'
						? 'Se completó correctamente el proceso de cambio de contraseña'
						: 'Se completó correctamente el pedido de recuperación de contraseña. Verifique su correo electrónico y siga las instrucciones.'
				}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : (
		<>
			<Form
				sendUserForm={processResult}
				formTitle={type === 'change' ? 'Cambio de contraseña' : 'Recuperación de contraseña'}
				icon={<FaUserLock />}
				rememberMe=""
				buttonText="ENVIAR"
				pageName={type === 'change' ? 'change-password' : 'forgot-password'}
				footer={
					type === 'change' ? null : (
						<>
							<div className="form-footer">
								<div className="separator" />
								<Link className="text-center" to="/">
									Volver
								</Link>
							</div>
						</>
					)
				}
			/>
			{emailIsValid && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'El correo electrónico ingresado no corresponde a ningún usuario registrado.'}
					closeText={'Cerrar'}
					closeFunction={() => setEmailIsValid(true)}
					error={emailIsValid}
				/>
			)}
		</>
	);
};

export default Password;
