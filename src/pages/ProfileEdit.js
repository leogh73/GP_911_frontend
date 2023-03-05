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
		result.userId ? setSuccess(true) : setError(true);
	};

	const goBack = () => {
		setError(false);
		setSuccess(false);
	};

	useEffect(() => {
		return () => {
			userContext.loadProfileData(null);
		};
	}, [userContext]);

	// console.log(userData);

	// let userSection;
	// if (section === 'Phoning') userSection = 'Teléfonía';
	// if (section === 'Monitoring') userSection = 'Monitoreo';
	// if (section === 'Dispatch') userSection = 'Despacho';

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
			title="Cambios guardados"
			icon={<FaUserCheck />}
			body="Nuevo usuario registrado exitosamente."
			buttonText="VOLVER"
			onClick={goBack}
		/>
	) : (
		<Form
			sendUserForm={() => console.log('click!')}
			formTitle="Editar perfil"
			icon={<FaUserEdit />}
			rememberMe=""
			buttonText="GUARDAR"
			pageName="edit-profile"
			profileData={startData}
		/>
	);
};

export default ProfileEdit;
