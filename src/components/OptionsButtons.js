import { useContext } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { IconContext } from 'react-icons';
import { MdEdit, MdHistory, MdOutlineCheck, MdOutlineClose } from 'react-icons/md';
import { CgUnavailable } from 'react-icons/cg';
import { CiNoWaitingSign } from 'react-icons/ci';

import { FcCancel } from 'react-icons/fc';
import { MdDeleteForever } from 'react-icons/md';
import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';
import './OptionsButtons.css';

const OptionsButtons = ({ type, data, callbackFn }) => {
	const { httpRequestHandler } = useHttpConnection();
	const context = useContext(UserContext);
	const fullName = `${context.lastName} ${context.firstName}`;

	const generateRandomId = () => (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');

	const button = (icon, idModal, title, body, actionFunction) => (
		<div className="option-container">
			<Modal
				id={idModal}
				clickComponent={<div className="option-button">{icon}</div>}
				title={title}
				body={body}
				actionFunction={actionFunction}
				closeText="No"
			/>
		</div>
	);

	const optionButtons = () => {
		if (context.superior) {
			if (type === 'change' && data.status === 'Solicitado')
				return (
					<>
						{button(
							<MdOutlineCheck size={24} />,
							generateRandomId(),
							'Confirmar aprobar cambio',
							`¿Aprobar cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
							() => modifyData('approve', data._id),
						)}
						{button(
							<MdOutlineClose size={24} />,
							generateRandomId(),
							'Confirmar no aprobar cambio',
							`¿No aprobar cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
							() => modifyData('notapprove', data._id),
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
							() => modifyData('void', data._id),
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
							() => modifyData('void', data._id),
						)}
					</>
				);
		}
		if (!context.superior) {
			if (type === 'change' && fullName === data.coverData.name && data.status === 'Solicitado')
				return (
					<>
						{button(
							<MdEdit size={24} />,
							generateRandomId(),
							'Confirmar eliminar cambio',
							`¿Anular cambio de servicio para ${data.name}?`,
							() => modifyData('void', data._id),
						)}
						{button(
							<MdDeleteForever size={24} />,
							generateRandomId(),
							'Confirmar cancelar cambio',
							`¿Cancelar cambio con ${data.returnData.name}?`,
							() => modifyData('cancel', data._id),
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
							() => modifyData('cancel', data._id),
						)}
					</>
				);
			}
		}
	};

	const modifyData = async (action, changeId) => {
		let url = '';
		let body = {};
		if (!context.superior) {
			url = 'http://localhost:5000/api/changes/cancel';
			body.changeId = changeId;
		}
		if (context.superior) {
			url = 'http://localhost:5000/api/changes/modify';
			body.action = action;
			body.changeId = changeId;
		}

		try {
			let consult = await httpRequestHandler(url, 'POST', JSON.stringify(body), {
				authorization: `Bearer ${context.token}`,
				'Content-type': 'application/json',
			});
			callbackFn(action, consult);
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
				{button(<MdHistory size={30} />, generateRandomId(), () =>
					modifyData('approve', data._id),
				)}
			</div>
		</IconContext.Provider>
	);
};

export default OptionsButtons;
