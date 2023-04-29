import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserEdit, FaUserTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

import 'react-calendar/dist/Calendar.css';

import UserContext from '../context/UserContext';

const ProfileEdit = ({ startData }) => {
	const [success, setSuccess] = useState();
	const [error, setError] = useState();
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	const editResult = (result, ownProfile) => {
		if (ownProfile) {
			result._id ? setSuccess(true) : setError(true);
		} else {
			result.result._id
				? toast('Usuario modificado correctamente', { type: 'success' })
				: toast('No se pudo completar el proceso.', { type: 'error' });
			navigate(`/users/${startData.section.toLowerCase()}`);
		}
	};

	useEffect(() => {
		return () => {
			userContext.dispatch({
				type: 'load profile edit data',
				payload: { profile: {}, editRoute: false },
			});
		};
	}, [userContext]);

	const goBack = () => {
		setError(false);
		setSuccess(false);
		navigate('/profile');
	};

	return error ? (
		<div className="new-form">
			<Message
				title={'Edición fallida'}
				icon={<FaUserTimes />}
				body={`No se pudo completar el proceso de edición de perfil. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas.`}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : success ? (
		<div className="new-form">
			<Message
				title={'Solicitud correcta'}
				icon={<FaUserCheck />}
				body={
					'Se envió su pedido para cambio de datos. Verifique su correo electrónico y siga las instrucciones. Si cambió su correo electrónico, verifique la nueva dirección. Si no lo encuentra en su bandeja de entrada, verifique su correo no deseado o spam.'
				}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : (
		<Form
			sendUserForm={editResult}
			formTitle="Editar perfil"
			icon={<FaUserEdit />}
			buttonText="GUARDAR"
			pageName="profile-edit"
			profile={{ data: startData, view: true }}
		/>
	);
};

export default ProfileEdit;
