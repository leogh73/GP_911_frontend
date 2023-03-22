import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import {
	FaUsers,
	FaUser,
	FaIdCard,
	FaBuilding,
	FaEnvelope,
	FaKey,
	FaUserEdit,
	FaUserCheck,
	FaUserTimes,
} from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';
import { TbHierarchy } from 'react-icons/tb';

import { ToastContainer } from 'react-toastify';
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
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	const modificationResult = (result) => {
		console.log(result);
		result._id ? setSuccess(true) : setError(true);
	};

	const goBack = () => {
		setError(false);
		setSuccess(false);
		navigate(`/users/${startData.section.toLowerCase()}`);
	};

	useEffect(() => {
		return () => {
			userContext.dispatch({
				type: 'load profile data',
				payload: { profile: null, editRoute: false },
			});
		};
	}, [userContext]);

	// console.log(userData);

	// let userSection;
	// if (section === 'Phoning') userSection = 'Teléfonía';
	// if (section === 'Monitoring') userSection = 'Monitoreo';
	// if (section === 'Dispatch') userSection = 'Despacho';

	return error ? (
		<div className="new-form">
			<Message
				title="Proceso fallido"
				icon={<FaUserTimes />}
				body="No se pudo completar el proceso de edición de datos. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : success ? (
		<div className="new-form">
			<Message
				title="Cambios guardados"
				icon={<FaUserCheck />}
				body="Datos de usuario modificados correctamente."
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : (
		<Form
			sendUserForm={modificationResult}
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
