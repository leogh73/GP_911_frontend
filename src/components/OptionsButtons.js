import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { IconContext } from 'react-icons';
import {
	MdDelete,
	MdEdit,
	MdHistory,
	MdOutlineCancel,
	MdOutlineCheck,
	MdOutlineClose,
} from 'react-icons/md';
import { CgUnavailable } from 'react-icons/cg';
import { MdDeleteForever } from 'react-icons/md';
import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';
import './OptionsButtons.css';
import Changelog from './Changelog';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import CommentContext from '../context/CommentContext';

const OptionsButtons = ({ type, data, callbackFn }) => {
	const { httpRequestHandler } = useHttpConnection();
	const userContext = useContext(UserContext);
	const commentContext = useContext(CommentContext);
	const fullName = `${userContext.userData.lastName} ${userContext.userData.firstName}`;
	const navigate = useNavigate();

	const generateRandomId = () => (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');

	const editChangePage = () => {
		userContext.loadChangeData(data);
		userContext.activateEditionRoute(true);
		navigate('/changes/edit');
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
							'Confirmar aprobar cambio',
							`¿Aprobar cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
							() => modifyData(type, data._id, { previous: data.status, new: 'Aprobado' }),
							'No',
							true,
						)}
						{button(
							<MdOutlineClose size={24} />,
							generateRandomId(),
							'Confirmar no aprobar cambio',
							`¿No aprobar cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
							() => modifyData(type, data._id, { previous: data.status, new: 'No aprobado' }),
							'No',
							true,
						)}
					</>
				);
			if (type === 'change' && data.status === 'Aprobado')
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
							`¿Anular cambio de servicio para ${data.name}?`,
							() => modifyData(type, data._id, null),
							'No',
							false,
						)}
					</>
				);
		}
		if (!userContext.userData.superior) {
			if (fullName === (data.coverData.date || data.returnData.name)) {
				console.log(data.returnData.name);
				console.log(fullName);
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
		}
	};

	const modifyData = async (type, itemId, status) => {
		// let url = '';
		// let body = {};
		// if (!userContext.userData.superior) {
		// 	url = 'http://localhost:5000/api/changes/cancel';
		// 	body.changeId = changeId;
		// }
		// if (userContext.userData.superior) {
		// url = 'http://localhost:5000/api/changes/modify';
		// body.action = action;
		// body.changeId = changeId;
		// }

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
