import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserLock, FaUserTimes } from 'react-icons/fa';

const Password = ({ type }) => {
	const [success, setSuccess] = useState();
	const [error, setError] = useState();
	const navigate = useNavigate();

	const processResult = (result) => (result._id[0] ? setSuccess(true) : setError(true));

	const goBack = () => {
		setError(false);
		setSuccess(false);
		navigate('/');
	};

	return error ? (
		<div className="changes-list">
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
		<div className="changes-list">
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
				pageName={type === 'change' ? 'change-password' : 'forgot-password'}
				formData={{
					title: type === 'change' ? 'Cambio de contraseña' : 'Recuperación de contraseña',
					icon: <FaUserLock />,
					rememberMe: '',
					buttonText: 'ENVIAR',
					footer:
						type === 'change' ? null : (
							<>
								<div className="form-footer">
									<div className="separator" />
									<Link className="text-center" to="/">
										Volver
									</Link>
								</div>
							</>
						),
				}}
			/>
		</>
	);
};

export default Password;
