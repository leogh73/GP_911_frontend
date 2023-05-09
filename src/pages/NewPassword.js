import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserLock, FaUserTimes } from 'react-icons/fa';

import 'react-calendar/dist/Calendar.css';

import Loading from '../components/Loading';
import useHttpConnection from '../hooks/useHttpConnection';

const NewPassword = () => {
	const [status, setStatus] = useState('loading');
	const [userId, setUserId] = useState(null);
	const { httpRequestHandler } = useHttpConnection();
	const navigate = useNavigate();
	const location = useLocation();
	const token = location.pathname.split('/token=')[1];

	const checkToken = useCallback(async () => {
		try {
			let consult = await httpRequestHandler(
				`${process.env.REACT_APP_API_URL}/api/user/forgot-password`,
				'POST',
				JSON.stringify({ token }),
				{ 'Content-type': 'application/json' },
			);
			if (consult.error) return setStatus('token not valid');
			setStatus('');
			setUserId(consult._id);
		} catch (error) {
			setStatus('token not valid');
		}
	}, [httpRequestHandler, token]);

	const processResult = (result) => {
		result.result._id ? setStatus('password success') : setStatus('password error');
	};

	useEffect(() => {
		checkToken();
		return () => {
			setStatus('loading');
		};
	}, [checkToken]);

	const goBack = () => navigate('/');

	const contentHandler = () => {
		let content = (
			<Form
				sendUserForm={processResult}
				pageName={'new-password'}
				formData={{
					title: 'Nueva contraseña',
					icon: <FaUserLock />,
					rememberMe: '',
					buttonText: 'ENVIAR',
					profile: { userId: userId },
					footer: (
						<div className="form-footer">
							<div className="separator" />
							<Link className="text-center" to="/">
								Volver
							</Link>
						</div>
					),
				}}
			/>
		);
		if (status === 'loading')
			content = (
				<div className="spinner-container-change">
					<Loading type={'closed'} />
				</div>
			);
		if (status === 'token not valid')
			content = (
				<div className="new-form">
					<Message
						title={'Acceso incorrecto'}
						icon={<FaUserCheck />}
						body={'Los datos de solicitud son inválidos.'}
						buttonText="VOLVER"
						onClick={goBack}
					/>
				</div>
			);
		if (status === 'password error')
			content = (
				<div className="new-form">
					<Message
						title={'Cambio de contraseña fallido'}
						icon={<FaUserTimes />}
						body={`No se pudo completar el proceso de cambio de contraseña.`}
						buttonText="VOLVER"
						onClick={goBack}
					/>
				</div>
			);
		if (status === 'password success')
			return (
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
			);
		return content;
	};

	return <>{contentHandler()}</>;
};

export default NewPassword;
