import React from 'react';
import useListData from '../hooks/useListData';
import { useNavigate } from 'react-router-dom';
import './Table.css';

import Title from './Title';
import Button from './Button';

import { toast } from 'react-toastify';
import { IconContext } from 'react-icons';
import { BiDownArrow } from 'react-icons/bi';
import { GoSearch } from 'react-icons/go';
import './Table.css';
import Row from './Row';

const Table = ({ id, headersList, rowType, dataList, newLink }) => {
	const { listData, dispatch } = useListData(dataList);
	const navigate = useNavigate();

	const resultModifyRow = (action, result) => {
		let accion;
		if (action === 'cancel') accion = 'cancelado';
		if (action === 'approve') accion = 'aprobado';
		if (action === 'notapprove') accion = 'no aprobado';
		if (action === 'void') accion = 'anulado';
		if (result && result._id) {
			dispatch({ payload: { action, type: 'change', id: result._id } });
			toast(`Cambio ${accion} correctamente.`, { type: 'success' });
		}
		if (!result || result.error) toast('No se pudo completar el proceso.', { type: 'error' });
	};

	const headerClickHandler = (i, value) => {
		let buttons = document.getElementById(id).querySelectorAll('.arrow-down');
		buttons[i].classList.contains('arrow-active')
			? buttons[i].classList.toggle('click')
			: buttons[i].classList.toggle('arrow-active');
		buttons.forEach((button, index) => {
			if (i !== index) {
				if (button.classList.contains('arrow-active')) button.classList.toggle('arrow-active');
				if (button.classList.contains('click')) button.classList.toggle('click');
			}
		});
		dispatch({ payload: { type: 'header', list: rowType, value } });
	};

	const radioClickHandler = (e) => {
		let value = e.target.getAttribute('value');
		if (e.target.classList.value !== 'changes-radio-icon') {
			document
				.getElementById(id)
				.querySelectorAll('.changes-radio-icon')
				.forEach((icon) => {
					if (icon.value === value && !icon.checked) {
						icon.checked = true;
					} else if (icon.value !== value && icon.checked) {
						icon.checked = false;
					}
				});
		}
		dispatch({ payload: { type: 'radioButton', list: rowType, value } });
	};

	const inputChangeHandler = (e) => {
		dispatch({ payload: { type: 'searchInput', list: rowType, value: e.target.value } });
	};

	return (
		<div id={id}>
			<div className="changes-filters">
				<div className="radio-buttons">
					<div className="changes-filter" value="Todos" name="todos" onClick={radioClickHandler}>
						<input
							type="radio"
							className="changes-radio-icon"
							value="Todos"
							name={id}
							defaultChecked={true}
						/>
						Todos
					</div>
					<div
						className="changes-filter"
						value="Propios"
						name="propios"
						onClick={radioClickHandler}
					>
						<input type="radio" className="changes-radio-icon" value="Propios" name={id} />
						Propios
					</div>
				</div>
				<div className="changes-search-box">
					<div className="changes-search-icon">
						<GoSearch />
					</div>
					<input className="changes-search" placeholder="Buscar" onChange={inputChangeHandler} />
				</div>

				<Button text={'NUEVO CAMBIO'} width={170} onClick={() => navigate(newLink)} />
			</div>
			{listData.filter.length ? (
				<table>
					<thead>
						<tr>
							{headersList.map((h) => (
								<th key={h.key} onClick={() => headerClickHandler(h.key, h.title)}>
									<div className="table-header">
										{h.title}
										<div
											type="button"
											className={`${h.key === 0 ? 'arrow-down  arrow-active' : 'arrow-down'}`}
										>
											<BiDownArrow style={{ color: 'white' }} size={14} />
										</div>
									</div>
								</th>
							))}
							<th>Opciones</th>
						</tr>
					</thead>
					<tbody>
						{listData.filter.map((item) => (
							<Row
								key={Math.random() * 1000}
								type={rowType}
								data={item}
								modifyCallback={resultModifyRow}
							/>
						))}
					</tbody>
				</table>
			) : (
				<IconContext.Provider
					value={{
						style: {
							color: 'slategray',
							minWidth: '50px',
							minHeight: '50px',
							marginBottom: '5px',
						},
					}}
				>
					<div>
						<Title text={'No hay datos para mostrar.'} />
					</div>
				</IconContext.Provider>
			)}
		</div>
	);
};

export default Table;
