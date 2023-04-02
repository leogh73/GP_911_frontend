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

const Profile = () => {
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	const {
		username,
		firstName,
		lastName,
		ni,
		hierarchy,
		section,
		guardId,
		email,
		superior,
		admin,
	} = userContext.userData;

	let userSection;
	if (section === 'Phoning') userSection = 'Teléfonía';
	if (section === 'Monitoring') userSection = 'Monitoreo';
	if (section === 'Dispatch') userSection = 'Despacho';

	const profileData = [
		{ key: '01', icon: <HiUserCircle size={27} />, title: 'Usuario', data: username },
		{ key: '02', icon: <FaUser />, title: 'Nombre', data: firstName },
		{ key: '03', icon: <FaUser />, title: 'Apellido', data: lastName },
		{ key: '04', icon: <FaIdCard />, title: 'NI', data: ni },
		{ key: '05', icon: <TbHierarchy size={22} />, title: 'Jerarquía', data: hierarchy },
		{ key: '06', icon: <FaBuilding />, title: 'Sección', data: userSection },
		{ key: '07', icon: <FaUsers size={25} />, title: 'Guardia', data: guardId ?? '-' },
		{ key: '08', icon: <FaEnvelope />, title: 'Correo electrónico', data: email },
	];

	if (superior || admin)
		profileData.push(
			{
				key: '09',
				icon: <MdSupervisorAccount size={28} />,
				title: 'Superior',
				data: superior ? 'Si' : 'No',
			},
			{ key: '10', icon: <GrUserAdmin />, title: 'Administrador', data: admin ? 'Si' : 'No' },
		);

	const divIndex = superior || admin ? 5 : 4;

	const changeSection = (key, icon, title, data) => (
		<div key={key} className="user-profile-section">
			<div className="section-icon">{icon}</div>
			<div className="section-text-profile">
				<div className="section-title">{title}</div>
				{data}
			</div>
		</div>
	);

	return (
		<div className="new-change">
			<Title icon={<CgProfile />} text={'Perfil'} />
			<div className="new-change-data">
				<div className="user-change-section">
					{profileData.map(
						(p, i) => i < divIndex && changeSection(p.key, p.icon, p.title, p.data),
					)}
				</div>
				<div className="user-change-section">
					{profileData.map(
						(p, i) => i >= divIndex && changeSection(p.key, p.icon, p.title, p.data),
					)}
				</div>
			</div>
			<Button
				className="button"
				text={'EDITAR'}
				width={200}
				// disabled={!dataIsValid}
				// loading={loadingSendData}
				onClick={() => {
					userContext.dispatch({
						type: 'load profile edit data',
						payload: { profile: userContext.userData },
					});
					navigate('/profile/edit');
				}}
			/>
		</div>
	);
};

export default Profile;
