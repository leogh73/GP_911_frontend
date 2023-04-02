import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

import useHttpConnection from '../hooks/useHttpConnection';
import UserContext from '../context/UserContext';
import { CgProfile } from 'react-icons/cg';
import { MdSupervisorAccount } from 'react-icons/md';
import { GrUserAdmin } from 'react-icons/gr';
import Loading from '../components/Loading';

const ProfileEditConfirm = () => {
	const { httpRequestHandler } = useHttpConnection();
	const [success, setSuccess] = useState();
	const [loading, setLoading] = useState(true);
	const [result, setResult] = useState();
	const userContext = useContext(UserContext);
	const navigate = useNavigate();
	const location = useLocation();
	const tokenData = location.pathname.split('/token=')[1];

	const confirmProfileChange = useCallback(async () => {
		try {
			console.log('CONFIRM CHANGES!!');
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/user/profile-edit',
				'POST',
				JSON.stringify({ changeToken: tokenData }),
				{ authorization: `Bearer ${userContext.token}`, 'Content-type': 'application/json' },
			);
			if (consult.error) return setSuccess(false);
			setResult(consult.result);
			// profileContext.loadProfileData(consult.result);
			// console.log(consult.result);
			// userContext.dispatch({
			// 	type: 'load profile user data',
			// 	payload: { profile: consult },
			// });
			// consult.token = userContext.userData.token;
			// consult.userId = consult._id;
			// userContext.login(consult);
			setSuccess(true);
		} catch (error) {
			console.log(error);
			setSuccess(false);
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, tokenData, userContext.token]);

	useEffect(() => {
		confirmProfileChange();
		return () => setLoading(true);
	}, [confirmProfileChange]);

	const goBack = () => {
		if (!result.error) {
			result.token = userContext.userData.token;
			result.userId = result._id;
			userContext.login(result);
		}
		navigate('/profile');
	};

	return loading ? (
		<div className="spinner-container-change">
			<Loading type={'closed'} />
		</div>
	) : success ? (
		<div className="new-form">
			<Message
				title={'Cambio confirmado'}
				icon={<FaUserCheck />}
				body={'Se han modificado correctamente los datos de su perfil.'}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : (
		<div className="new-form">
			<Message
				title={'Solicitud fallida'}
				icon={<FaUserTimes />}
				body={
					'No se pudieron editar sus datos de perfil. Reintente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas.'
				}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	);
};

export default ProfileEditConfirm;
