import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { IconContext } from 'react-icons';
import { MdEdit, MdHistory, MdOutlineCheck, MdOutlineClose } from 'react-icons/md';
import { CgUnavailable } from 'react-icons/cg';
import { MdDeleteForever } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { RiRotateLockFill } from 'react-icons/ri';
import UserContext from '../context/UserContext';

import Changelog from './Changelog';
import Modal from './Modal';
import './OptionsButtons.css';

import CommentContext from '../context/CommentContext';
import useHttpConnection from '../hooks/useHttpConnection';

const OptionsButtons = ({ type, data, callbackFn }) => {
	const userContext = useContext(UserContext);
	const { httpRequestHandler } = useHttpConnection();
	const commentContext = useContext(CommentContext);
	const fullName = `${userContext.userData.lastName} ${userContext.userData.firstName}`;
	const navigate = useNavigate();

	const generateRandomId = () => (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');

	const editChangePage = () => {
		userContext.dispatch({ type: 'load change data', payload: { change: data, editRoute: true } });
		navigate('/changes/edit');
	};

	const editProfilePage = () => {
		console.log(data);
		userContext.dispatch({
			type: 'load profile edit data',
			payload: { profile: data, editRoute: true },
		});
		navigate('/profile/edit-user');
	};

	const button = (icon, idModal, texts, functions, type) => (
		<div className="option-container">
			<Modal
				id={idModal}
				texts={texts}
				functions={functions}
				clickComponent={<div className="option-button">{icon}</div>}
				type={type}
			/>
		</div>
	);

	const optionButtons = () => {
		if (userContext.userData.superior) {
			if (type === 'change' && data.status === 'Solicitado')
				return (
					<>
						{button(
							<MdOutlineCheck size={24} />,
							generateRandomId(),
							{
								title: 'Confirmar autorizar cambio',
								body: `¿Autorizar cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
								close: 'No',
								comment: true,
							},
							{
								action: () =>
									modifyData(type, data._id, { previous: data.status, new: 'Autorizado' }),
							},
						)}
						{button(
							<MdOutlineClose size={24} />,
							generateRandomId(),
							{
								title: 'Confirmar no autorizar cambio',
								body: `¿No autorizar cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
								close: 'No',
								comment: true,
							},
							{
								action: () =>
									modifyData(type, data._id, { previous: data.status, new: 'No autorizado' }),
							},
						)}
					</>
				);
			if (type === 'change' && data.status === 'Autorizado')
				return (
					<>
						{button(
							<CgUnavailable size={32} />,
							generateRandomId(),
							{
								title: 'Confirmar anular cambio',
								body: `¿Anular cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
								close: 'No',
								comment: true,
							},
							{
								action: () =>
									modifyData(type, data._id, { previous: data.status, new: 'Anulado' }),
							},
						)}
					</>
				);
			if (type === 'affected')
				return (
					<>
						{button(
							<MdDeleteForever size={24} />,
							generateRandomId(),
							{
								title: 'Confirmar eliminar cambio',
								body: `¿Eliminar cambio de servicio para ${data.name}?`,
								close: 'No',
								comment: false,
							},
							{ action: () => modifyData(type, data._id, null) },
						)}
					</>
				);
		}
		if (type === 'user' && userContext.userData.admin) {
			return (
				<>
					<div className="option-container">
						<div className="option-button" onClick={editProfilePage}>
							{<MdEdit size={24} />}
						</div>
					</div>
					{button(
						<RiRotateLockFill size={28} />,
						generateRandomId(),
						{
							title: 'Confirmar reestablecer contraseña',
							body: `¿Reestrablecer contraseña para ${data.firstName} ${data.lastName}? Será reestablecida a "12345"`,
							close: 'No',
							comment: true,
						},
						{ action: () => modifyData(type, data._id, 'password') },
					)}
					{button(
						<MdDeleteForever size={24} />,
						generateRandomId(),
						{
							title: 'Confirmar eliminar usuario',
							body: '¿Eliminar usuario?',
							close: 'No',
							comment: false,
						},
						{ action: () => modifyData(type, data._id, null) },
					)}
				</>
			);
		}
		if (
			type === 'change' &&
			(fullName === data.coverData.name || fullName === data.returnData.name) &&
			data.status === 'Solicitado'
		)
			return (
				<>
					<div className="option-container">
						<div className="option-button" onClick={editChangePage}>
							{<MdEdit size={24} />}
						</div>
					</div>
					{button(
						<IoMdClose size={28} />,
						generateRandomId(),
						{
							title: 'Confirmar cancelar cambio',
							body: `¿Cancelar cambio con ${
								fullName === data.coverData.name ? data.returnData.name : data.coverData.name
							}?`,
							close: 'No',
							comment: true,
						},
						{
							action: () =>
								modifyData(type, data._id, { previous: data.status, new: 'Cancelado' }),
						},
					)}
				</>
			);
		if (
			type === 'change' &&
			(fullName === data.coverData.name || fullName === data.returnData.name) &&
			data.status === 'Autorizado'
		)
			return (
				<>
					{button(
						<IoMdClose size={28} />,
						generateRandomId(),
						{
							title: 'Confirmar cancelar cambio',
							body: `¿Cancelar cambio con ${
								fullName === data.coverData.name ? data.returnData.name : data.coverData.name
							}?`,
							close: 'No',
							comment: true,
						},
						{
							action: () =>
								modifyData(type, data._id, { previous: data.status, new: 'Cancelado' }),
						},
					)}
				</>
			);
		if (type === 'change' && fullName === data.coverData.name && data.status === 'Cancelado')
			return (
				<>
					{button(
						<MdDeleteForever size={28} />,
						generateRandomId(),
						{
							title: 'Confirmar eliminar cambio',
							body: `¿Eliminar cambio con ${data.returnData.name}?`,
							close: 'No',
							comment: false,
						},
						{ action: () => modifyData(type, data._id, null) },
					)}
				</>
			);
		if (type === 'request' && fullName === data.name) {
			return (
				<>
					{button(
						<MdDeleteForever size={24} />,
						generateRandomId(),
						{
							title: 'Confirmar eliminar pedido',
							body: (
								<div className="modal-body-padding">{`¿Eliminar pedido de cambio para el ${data.requestData.date}?`}</div>
							),
							close: 'No',
							comment: false,
						},
						{ action: () => modifyData(type, data._id, null) },
					)}
				</>
			);
		}
	};

	const modifyData = async (type, itemId, status) => {
		try {
			let consult = await httpRequestHandler(
				`${process.env.REACT_APP_API_URL}/api/${type === 'user' ? 'user' : 'item'}/modify`,
				'POST',
				JSON.stringify({ type, itemId, status, comment: commentContext.comment }),
				{
					authorization: `Bearer ${userContext.token}`,
					'Content-type': 'application/json',
				},
			);
			if (consult.error === 'Token expired') {
				userContext.logout(true);
				navigate('/');
				return;
			}
			if (consult.newAccessToken) {
				const newUserData = { ...userContext.userData, token: consult.newAccessToken };
				userContext.login(newUserData);
			}
			callbackFn(status, consult);
		} catch (error) {
			toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
			console.log(error);
		}
	};

	return (
		<IconContext.Provider
			value={{
				style: { color: 'white' },
			}}
		>
			<div className="option-buttons">
				{optionButtons()}
				{(type === 'change' || type === 'user') &&
					button(
						<MdHistory size={30} />,
						generateRandomId(),
						{
							title: 'Historial de edición',
							body: <Changelog log={data.changelog} />,
							close: 'Cerrar',
							comment: false,
						},
						{ action: null },
						'changelog',
					)}
			</div>
		</IconContext.Provider>
	);
};

export default OptionsButtons;
