import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserEdit, FaUserLock, FaUserTimes } from 'react-icons/fa';
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

const RecoverPassword = () => {
	const { httpRequestHandler } = useHttpConnection();
	const [tokenIsValid, setTokenIsValid] = useState();
	const [errorPassword, setErrorPassword] = useState();
	const [successPassword, setSuccessPassword] = useState();
	const [userId, setUserId] = useState();
	const [loadingForm, setLoadingForm] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();
	const tokenData = location.pathname.split('/token=')[1];

	const checkToken = useCallback(async () => {
		try {
			console.log('CONFIRM CHANGES!!');
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/user/forgot-password',
				'POST',
				JSON.stringify({ token: tokenData }),
				{ 'Content-type': 'application/json' },
			);
			if (consult.error) return setTokenIsValid(false);
			setTokenIsValid(true);
			setUserId(consult._id);
		} catch (error) {
			setTokenIsValid(false);
		} finally {
			setLoadingForm(false);
		}
	}, [httpRequestHandler, tokenData]);

	const processResult = (result) => {
		result.result._id ? setSuccessPassword(true) : setErrorPassword(true);
	};

	useEffect(() => {
		checkToken();
		return () => {
			setLoadingForm(true);
			setSuccessPassword(null);
			setErrorPassword(null);
		};
	}, [checkToken]);

	const goBack = () => navigate('/');

	return loadingForm ? (
		<div className="spinner-container-change">
			<Loading type={'closed'} />
		</div>
	) : !tokenIsValid ? (
		<div className="new-form">
			<Message
				title={'Acceso incorrecto'}
				icon={<FaUserCheck />}
				body={'Los datos de solicitud son inválidos.'}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : errorPassword ? (
		<div className="new-form">
			<Message
				title={'Cambio de contraseña fallido'}
				icon={<FaUserTimes />}
				body={`No se pudo completar el proceso de cambio de contraseña.`}
				buttonText="VOLVER"
				onClick={goBack}
			/>
		</div>
	) : successPassword ? (
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
	) : (
		<Form
			sendUserForm={processResult}
			formTitle={'Nueva contraseña'}
			icon={<FaUserLock />}
			rememberMe=""
			buttonText="ENVIAR"
			pageName={'new-password'}
			userId={userId}
			footer={
				<>
					<div className="form-footer">
						<div className="separator" />
						<Link className="text-center" to="/">
							Volver
						</Link>
					</div>
				</>
			}
		/>
	);
};

export default RecoverPassword;
