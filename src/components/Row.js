import React, { useState } from 'react';
import CommentContext from '../context/CommentContext';
import OptionsButtons from './OptionsButtons';

const Row = ({ type, data, modifyCallback }) => {
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
						rowData: optionsButtons,
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
