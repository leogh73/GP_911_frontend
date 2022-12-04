import React, { useContext, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { SlOptionsVertical } from 'react-icons/sl';
import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';
import Button from './Button';
import Modal from './Modal';
import DropdownMenu from './Dropdown';

const Row = ({ type, data, modifyCallback }) => {
	const { httpRequestHandler } = useHttpConnection();
	const context = useContext(UserContext);
	const fullName = `${context.lastName} ${context.firstName}`;

	const loadButtons = () => {
		const idModalCancel = (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');
		const idModalAnnul = (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');
		const idModalApprove = (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');
		const idModalNotApprove = (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');

		const generateModalButton = (buttonText, idModal, title, body, actionFunction) => {
			return (
				<DropdownMenu
					id={idModal}
					name={'tab-options'}
					icon={<SlOptionsVertical size={22} />}
					titleValue={'OPCIONES'}
					optionsList={['6 a 14 hs.', '14 a 22 hs.', '22 a 6 hs.']}
					onChange={(e) => console.log('CLICK!')}
					style={{ top: '76px', padding: '5px' }}
				/>
			);
			// return (
			// 	<Modal
			// 		id={idModal}
			// 		clickComponent={<Button text={buttonText} width={150} />}
			// 		title={title}
			// 		body={body}
			// 		actionFunction={actionFunction}
			// 		closeText="No"
			// 	/>
			// );
		};

		console.log(data);

		if (!context.superior && fullName === data.coverData.name && data.status === 'Solicitado')
			return (
				<>
					{generateModalButton(
						'CANCELAR',
						idModalCancel,
						'Confirmar cancelar cambio',
						`¿Cancelar cambio con ${data.returnData.name}?`,
						() => modifyChange('cancel', data._id),
					)}
				</>
			);

		if (context.superior && data.status === 'Solicitado')
			return (
				<>
					{generateModalButton(
						'APROBAR',
						idModalApprove,
						'Confirmar aprobar cambio',
						`¿Aprobar cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
						() => modifyChange('approve', data._id),
					)}
					{generateModalButton(
						'NO APROBAR',
						idModalNotApprove,
						'Confirmar no aprobar cambio',
						`¿No aprobar cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
						() => modifyChange('notapprove', data._id),
					)}
				</>
			);

		if (context.superior && data.status === 'Aprobado')
			return (
				<>
					{generateModalButton(
						'ANULAR',
						idModalAnnul,
						'Confirmar anular cambio',
						`¿Anular cambio entre ${data.returnData.name} y ${data.coverData.name}?`,
						() => modifyChange('void', data._id),
					)}
				</>
			);
		else {
			return <></>;
		}
	};

	const modifyChange = useCallback(
		async (action, changeId) => {
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
				modifyCallback(action, consult);
			} catch (error) {
				toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
				console.log(error);
			}
		},
		[httpRequestHandler, context, modifyCallback],
	);

	const changeText = (s) => `${s.date} - ${s.shift} - ${s.day} - Guardia ${s.guardId}`;

	const generateRow = (dataList) => (
		<>
			{dataList.map((item) => (
				<td className="row-data" key={item.columnName}>
					<div className="col-name">{item.columnName}</div>
					<div className="data-col">{item.rowData}</div>
				</td>
			))}
		</>
	);

	const rowContent = () => {
		switch (type) {
			case 'change': {
				return generateRow([
					{
						columnName: '#',
						rowData: data.priorityId,
					},
					{ columnName: 'Quien cubre', rowData: data.coverData.name },
					{
						columnName: 'A cubrir',
						rowData: changeText(data.coverData),
					},
					{
						columnName: 'Quien devuelve',
						rowData: data.returnData.name,
					},
					{
						columnName: 'A devolver',
						rowData: changeText(data.returnData),
					},
					{
						columnName: 'Estado',
						rowData: data.status,
					},
					{
						columnName: 'Opciones',
						rowData: '(BOTON OPCIONES)',
					},
				]);
			}
			case 'request': {
				return generateRow([
					{
						columnName: '#',
						rowData: data.priorityId,
					},
					{ columnName: 'Personal', rowData: data.name },
					{
						columnName: 'Pedido',
						rowData: changeText(data.requestData),
					},
					{
						columnName: 'Ofrecido',
						rowData: changeText(data.offerData),
					},
					{
						columnName: 'Opciones',
						rowData: '(BOTON OPCIONES)',
					},
				]);
			}
			case 'affected': {
				return generateRow([
					{
						columnName: '#',
						rowData: data.priorityId,
					},
					{ columnName: 'Personal', rowData: data.name },
					{
						columnName: 'Afectado',
						rowData: changeText(data.affectedData),
					},
					{
						columnName: 'Desafectado',
						rowData: changeText(data.disaffectedData),
					},
					{
						columnName: 'Foja del Libro de Guardia',
						rowData: data.bookPage,
					},
					{
						columnName: 'Opciones',
						rowData: '(BOTON OPCIONES)',
					},
				]);
			}

			default:
				break;
		}
	};

	return <tr>{rowContent()}</tr>;
};

export default Row;
