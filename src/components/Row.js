import React, { useState, useContext } from 'react';
import UserContext from '../context/UserContext';
import CommentContext from '../context/CommentContext';
import OptionsButtons from './OptionsButtons';

const Row = ({ type, data, modifyCallback }) => {
	const userContext = useContext(UserContext);
	const [commentString, setCommentString] = useState('');
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

	const optionsButtons = <OptionsButtons type={type} data={data} callbackFn={modifyCallback} />;

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
						rowData: optionsButtons,
					},
				]);
			}
			case 'request': {
				let rowData = [
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
						rowData: data.offerData.date === '-' ? null : changeText(data.offerData),
					},
					{
						columnName: 'Comentario',
						rowData: data.comment === '-' ? null : data.comment,
					},
				];
				if (!userContext.userData.superior)
					rowData.push({
						columnName: 'Opciones',
						rowData: optionsButtons,
					});
				return generateRow(rowData);
			}
			case 'affected': {
				let rowData = [
					{
						columnName: '#',
						rowData: data.priorityId,
					},
					{ columnName: 'Superior', rowData: data.superior },
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
						columnName: 'Comentario',
						rowData: data.comment,
					},
					{
						columnName: 'Foja del Libro de Guardia',
						rowData: data.bookPage,
					},
				];
				if (userContext.userData.superior)
					rowData.push({
						columnName: 'Opciones',
						rowData: optionsButtons,
					});
				return generateRow(rowData);
			}
			case 'user': {
				return generateRow([
					{ columnName: 'Apellido', rowData: data.lastName },
					{
						columnName: 'Nombre',
						rowData: data.firstName,
					},
					{
						columnName: 'NI',
						rowData: data.ni,
					},
					{
						columnName: 'Jerarquía',
						rowData: data.hierarchy,
					},
					{
						columnName: 'Guardia',
						rowData: data.guardId ?? '-',
					},
					{
						columnName: 'Usuario',
						rowData: data.username,
					},
					{
						columnName: 'Correo electrónico',
						rowData: data.email,
					},
					{
						columnName: 'Opciones',
						rowData: optionsButtons,
					},
				]);
			}

			default:
				break;
		}
	};

	return (
		<CommentContext.Provider
			value={{
				comment: commentString,
				loadComment: setCommentString,
			}}
		>
			<tr>{rowContent()}</tr>
		</CommentContext.Provider>
	);
};

export default Row;
