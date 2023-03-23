import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserEdit } from 'react-icons/fa';
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
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	const editResult = (result) => {
		result._id
			? toast('Usuario modificado correctamente', { type: 'success' })
			: toast('No se pudo completar el proceso.', { type: 'error' });
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

	return (
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
