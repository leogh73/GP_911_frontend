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
import useHttpConnection from '../hooks/useHttpConnection';
import Changelog from './Changelog';
import Modal from './Modal';
import './OptionsButtons.css';

import CommentContext from '../context/CommentContext';
import SectionContext from '../context/SectionContext';

const OptionsButtons = ({ type, data, callbackFn }) => {
	const { httpRequestHandler } = useHttpConnection();
	const userContext = useContext(UserContext);
	const commentContext = useContext(CommentContext);
	const sectionContext = useContext(SectionContext);
	const fullName = `${userContext.userData.lastName} ${userContext.userData.firstName}`;
	const navigate = useNavigate();

	const generateRandomId = () => (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');

	const editChangePage = () => {
		userContext.dispatch({ type: 'load change data', payload: { change: data, editRoute: true } });
		navigate('/changes/edit');
	};

	const editProfilePage = () => {
		userContext.dispatch({
			type: 'load profile data',
			payload: { change: data, editRoute: true },
		});
		navigate('/profile/edit');
	};

	const button = (icon, idModal, title, body, actionFunction, closeText, comment) => (
		<div className="option-container">
			<Modal
				id={idModal}
				title={title}
				clickComponent={<div className="option-button">{icon}</div>}
				body={body}
				actionFunction={actionFunction}
				closeText={closeText}
				comment={comment}
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
							'Confirmar autorizar cambio',
							`¿Autorizar cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
							() => modifyData(type, data._id, { previous: data.status, new: 'Autorizado' }),
							'No',
							true,
						)}
						{button(
							<MdOutlineClose size={24} />,
							generateRandomId(),
							'Confirmar no autorizar cambio',
							`¿No autorizar cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
							() => modifyData(type, data._id, { previous: data.status, new: 'No autorizado' }),
							'No',
							true,
						)}
					</>
				);
			if (type === 'change' && data.status === 'Autorizado')
				return (
					<>
						{button(
							<CgUnavailable size={32} />,
							generateRandomId(),
							'Confirmar anular cambio',
							`¿Anular cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
							() => modifyData(type, data._id, { previous: data.status, new: 'Anulado' }),
							'No',
							true,
						)}
					</>
				);
			if (type === 'affected')
				return (
					<>
						{button(
							<MdDeleteForever size={24} />,
							generateRandomId(),
							'Confirmar eliminar cambio',
							`¿Eliminar cambio de servicio para ${data.name}?`,
							() => modifyData(type, data._id, null),
							'No',
							false,
						)}
					</>
				);
		}
		if (
			(type === 'user' && userContext.userData.admin) ||
			(userContext.userData.superior && userContext.userData.section === sectionContext.section)
		) {
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
						'Confirmar reinicio de contraseña',
						`¿Reiniciar contraseña para ${data.firstName} ${data.lastName}? Será reestablecida a "12345"`,
						() => modifyData(type, data._id, { previous: data.status, new: 'Cancelado' }),
						'No',
						true,
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
						'Confirmar cancelar cambio',
						`¿Cancelar cambio con ${
							fullName === data.coverData.name ? data.returnData.name : data.coverData.name
						}?`,
						() => modifyData(type, data._id, { previous: data.status, new: 'Cancelado' }),
						'No',
						true,
					)}
				</>
			);
		if (type === 'change' && fullName === data.coverData.name && data.status === 'Cancelado')
			return (
				<>
					{button(
						<MdDeleteForever size={28} />,
						generateRandomId(),
						'Confirmar eliminar cambio',
						`¿Eliminar cambio con ${data.returnData.name}?`,
						() => modifyData(type, data._id, null),
						'No',
						false,
					)}
				</>
			);
		if (type === 'request' && fullName === data.name) {
			return (
				<>
					{button(
						<MdDeleteForever size={24} />,
						generateRandomId(),
						'Confirmar eliminar pedido',
						`¿Eliminar pedido de cambio para el ${data.requestData.date}?`,
						() => modifyData(type, data._id, null),
						'No',
						false,
					)}
				</>
			);
		}
	};

	const modifyData = async (type, itemId, status) => {
		try {
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/item/modify',
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
				{type === 'change' &&
					button(
						<MdHistory size={30} />,
						generateRandomId(),
						'Historial de edición',
						<Changelog log={data.changelog} />,
						null,
						'Cerrar',
						false,
					)}
			</div>
		</IconContext.Provider>
	);
};

export default OptionsButtons;
