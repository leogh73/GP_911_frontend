import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserEdit, FaUserTimes } from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';
import { TbHierarchy } from 'react-icons/tb';

import { toast, ToastContainer } from 'react-toastify';
import { BiCommentDetail } from 'react-icons/bi';

import 'react-calendar/dist/Calendar.css';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Title from '../components/Title';

import UserContext from '../context/UserContext';
import { CgProfile } from 'react-icons/cg';
import { MdSupervisorAccount } from 'react-icons/md';
import { GrUserAdmin } from 'react-icons/gr';

const ProfileEdit = ({ startData }) => {
	const [success, setSuccess] = useState();
	const [error, setError] = useState();
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	const editResult = (result, ownProfile) => {
		if (ownProfile) {
			result._id ? setSuccess(true) : setError(true);
		} else {
			result._id
				? toast('Usuario modificado correctamente', { type: 'success' })
				: toast('No se pudo completar el proceso.', { type: 'error' });
			navigate(`/users/${startData.section.toLowerCase()}`);
		}
	};

	useEffect(() => {
		return () => {
			userContext.dispatch({
				type: 'load profile data',
				payload: { profile: null, editRoute: false },
			});
		};
	}, [userContext]);

	const goBack = () => {
		setError(false);
		setSuccess(false);
		navigate('/');
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
					'Se envió su pedido para cambio de datos. Verifique su correo electrónico y siga las instrucciones.'
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
			rememberMe=""
			buttonText="GUARDAR"
			pageName="profile-edit"
			profileData={startData}
			profileView={true}
		/>
	);
};

export default ProfileEdit;
