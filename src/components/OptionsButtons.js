import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { IconContext } from 'react-icons';
import { MdEdit, MdOutlineCheck, MdOutlineClose, MdShare } from 'react-icons/md';
import { CgUnavailable } from 'react-icons/cg';
import { MdDeleteForever } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { RiRotateLockFill } from 'react-icons/ri';
import UserContext from '../context/UserContext';

import button from './ButtonModal';
import './OptionsButtons.css';

import CommentContext from '../context/CommentContext';
import useHttpConnection from '../hooks/useHttpConnection';

const OptionsButtons = ({ type, data, callbackFn }) => {
	const [selectedData, setSelectedData] = useState({ id: data._id, button: '' });
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

	const optionButtons = () => {
		if (userContext.userData.superior) {
			if (type === 'change' && data.status === 'Solicitado')
				return (
					<>
						{button(
							data,
							selectedData,
							<MdOutlineCheck size={24} />,
							generateRandomId(),
							{
								title: 'Confirmar autorizar cambio',
								body: `¿Autorizar cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
								close: 'No',
								comment: true,
								id: 'authorize',
							},
							{
								action: () =>
									modifyData(
										type,
										data._id,
										{ previous: data.status, new: 'Autorizado' },
										'authorize',
									),
							},
						)}
						{button(
							data,
							selectedData,
							<MdOutlineClose size={24} />,
							generateRandomId(),
							{
								title: 'Confirmar no autorizar cambio',
								body: `¿No autorizar cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
								close: 'No',
								comment: true,
								id: 'not authorize',
							},
							{
								action: () =>
									modifyData(
										type,
										data._id,
										{ previous: data.status, new: 'No autorizado' },
										'not authorize',
									),
							},
						)}
					</>
				);

			if (type === 'change' && data.status === 'Autorizado')
				return (
					<>
						{button(
							data,
							selectedData,
							<CgUnavailable size={32} />,
							generateRandomId(),
							{
								title: 'Confirmar anular cambio',
								body: `¿Anular cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
								close: 'No',
								comment: true,
								id: 'nullify change',
							},
							{
								action: () =>
									modifyData(
										type,
										data._id,
										{ previous: data.status, new: 'Anulado' },
										'nullify change',
									),
							},
						)}
					</>
				);
			if (type === 'affected')
				return (
					<>
						{button(
							data,
							selectedData,
							<MdDeleteForever size={24} />,
							generateRandomId(),
							{
								title: 'Confirmar eliminar cambio',
								body: `¿Eliminar cambio de servicio para ${data.name}?`,
								close: 'No',
								comment: false,
								id: 'remove affected',
							},
							{ action: () => modifyData(type, data._id, null, 'remove affected') },
						)}
					</>
				);
		}
		if (type === 'user' && userContext.userData.admin) {
			return (
				<>
					<IconContext.Provider
						value={{
							style: { color: 'white' },
						}}
					>
						<div className="option-container">
							<div className="option-button" onClick={editProfilePage}>
								{<MdEdit size={24} />}
							</div>
						</div>
					</IconContext.Provider>
					{button(
						data,
						selectedData,
						<RiRotateLockFill size={28} />,
						generateRandomId(),
						{
							title: 'Confirmar reestablecer contraseña',
							body: `¿Reestrablecer contraseña para ${data.firstName} ${data.lastName}? Será reestablecida a "12345"`,
							close: 'No',
							comment: true,
							id: 'restore password',
						},
						{ action: () => modifyData(type, data._id, 'restore password') },
					)}
					{button(
						data,
						selectedData,
						<MdDeleteForever size={24} />,
						generateRandomId(),
						{
							title: 'Confirmar eliminar usuario',
							body: '¿Eliminar usuario?',
							close: 'No',
							comment: false,
							id: 'remove user',
						},
						{ action: () => modifyData(type, data._id, null, 'remove user') },
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
					<IconContext.Provider
						value={{
							style: { color: 'white' },
						}}
					>
						<div className="option-container">
							<div className="option-button" onClick={editChangePage}>
								{<MdEdit size={24} />}
							</div>
						</div>
					</IconContext.Provider>
					{button(
						data,
						selectedData,
						<IoMdClose size={28} />,
						generateRandomId(),
						{
							title: 'Confirmar cancelar cambio',
							body: `¿Cancelar cambio con ${
								fullName === data.coverData.name ? data.returnData.name : data.coverData.name
							}?`,
							close: 'No',
							comment: true,
							id: 'cancel requested change',
						},
						{
							action: () =>
								modifyData(
									type,
									data._id,
									{ previous: data.status, new: 'Cancelado' },
									'cancel requested change',
								),
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
						data,
						selectedData,
						<IoMdClose size={28} />,
						generateRandomId(),
						{
							title: 'Confirmar cancelar cambio',
							body: `¿Cancelar cambio con ${
								fullName === data.coverData.name ? data.returnData.name : data.coverData.name
							}?`,
							close: 'No',
							comment: true,
							id: 'cancel authorized change',
						},
						{
							action: () =>
								modifyData(
									type,
									data._id,
									{ previous: data.status, new: 'Cancelado' },
									'cancel authorized change',
								),
						},
					)}
				</>
			);
		if (type === 'change' && fullName === data.coverData.name && data.status === 'Cancelado')
			return (
				<>
					{button(
						data,
						selectedData,
						<MdDeleteForever size={28} />,
						generateRandomId(),
						{
							title: 'Confirmar eliminar cambio',
							body: `¿Eliminar cambio con ${data.returnData.name}?`,
							close: 'No',
							comment: false,
							id: 'remove change',
						},
						{ action: () => modifyData(type, data._id, null, 'remove change') },
					)}
				</>
			);
		if (type === 'request' && fullName === data.name) {
			return (
				<>
					{button(
						data,
						selectedData,
						<MdDeleteForever size={24} />,
						generateRandomId(),
						{
							title: 'Confirmar eliminar pedido',
							body: (
								<div className="modal-body-padding">{`¿Eliminar pedido de cambio para el ${data.requestData.date}?`}</div>
							),
							close: 'No',
							comment: false,
							id: 'remove request',
						},
						{ action: () => modifyData(type, data._id, null, 'remove request') },
					)}
				</>
			);
		}
	};

	const modifyData = async (type, itemId, status, buttonId) => {
		try {
			setSelectedData({ id: data._id, button: buttonId });
			let consult = await httpRequestHandler(
				`${process.env.REACT_APP_API_URL}/api/${type === 'user' ? 'user' : 'item'}/modify`,
				'POST',
				JSON.stringify({ type, itemId, status, comment: commentContext.comment }),
				{
					authorization: `Bearer ${userContext.token}`,
					'Content-type': 'application/json',
				},
			);
			console.log(consult);
			setSelectedData({ id: data._id, button: '' });
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

	const shareHandler = async () => {
		try {
			await navigator.clipboard.writeText(
				`https://guardias911.pages.dev/shared/${type}/${data._id}`,
			);
			toast('Enlace copiado', { type: 'info' });
		} catch (error) {
			toast('No se pudo copiar el enlace', { type: 'warning' });
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
				{type !== 'request' && type !== 'user' && (
					<div className="option-container">
						<div className="option-button" onClick={shareHandler}>
							{<MdShare size={24} />}
						</div>
					</div>
				)}
			</div>
		</IconContext.Provider>
	);
};

export default OptionsButtons;
