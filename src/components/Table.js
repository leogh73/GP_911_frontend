import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { BiDownArrow } from 'react-icons/bi';

import { GrSearch } from 'react-icons/gr';
import Title from './Title';
import Row from './Row';
import Button from './Button';

import './Table.css';

import useTableData from '../hooks/useTableData';
import UserContext from '../context/UserContext';
import SectionContext from '../context/SectionContext';
// import Toast from './Toast';

const Table = ({ id, headersList, rowType, dataList, newLink }) => {
	const userContext = useContext(UserContext);
	const sectionContext = useContext(SectionContext);
	const navigate = useNavigate();
	const { listData, dispatch } = useTableData(dataList, rowType);

	const resultMessage = (action, newStatus) => {
		let item;
		let message = 'No se pudo completar el proceso.';
		if (rowType === 'change') item = 'Cambio';
		if (rowType === 'request') item = 'Pedido';
		if (rowType === 'affected') item = 'Cambio de servicio';
		if (rowType === 'user') item = 'Usuario';
		if (action === 'delete') message = item + ' eliminado correctamente.';
		if (action === 'modify') {
			if (rowType !== 'user') message = `${item} ${newStatus.toLowerCase()}`;
			if (rowType === 'user') message = 'Contraseña restablecida';
			message = message + ' correctamente.';
		}
		return message;
	};

	const resultModifyRow = (status, consult) => {
		if (consult.result && consult.result._id) {
			if (!status) {
				dispatch({
					payload: {
						type: 'delete',
						id: consult.result._id,
					},
				});
				toast(resultMessage('delete'), {
					type: 'success',
				});
			} else {
				dispatch({
					payload: {
						type: 'modify',
						id: consult.result._id,
						status: rowType === 'change' ? status.new : null,
						changelog: consult.changelogItem,
					},
				});
				toast(resultMessage('modify', status.new), { type: 'success' });
			}
		}
		if (!consult || consult.error) {
			dispatch({
				payload: {
					type: 'error',
				},
			});
			toast(resultMessage(), { type: 'error' });
		}
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

	const typeContent = () => {
		let content = {};
		if (
			(!userContext.userData.superior && (rowType === 'change' || rowType === 'request')) ||
			(rowType === 'affected' && userContext.userData.superior) ||
			(rowType === 'user' && userContext.userData.admin) ||
			(rowType === 'user' &&
				userContext.userData.superior &&
				userContext.userData.section === sectionContext.section)
		) {
			content.newButton = (
				<Button
					text={`NUEVO ${rowType === 'user' ? 'USUARIO' : 'CAMBIO'}`}
					width={170}
					onClick={() => navigate(newLink)}
				/>
			);
		}
		if (!userContext.userData.superior || (rowType === 'user' && userContext.userData.superior)) {
			content.radioButtons = (
				<div className="radio-buttons">
					<div
						className="changes-filter"
						value={`${rowType === 'user' ? 'Subalternos' : 'Todos'}`}
						name="todos"
						onClick={radioClickHandler}
					>
						<input
							type="radio"
							className="changes-radio-icon"
							value={`${rowType === 'user' ? 'Subalternos' : 'Todos'}`}
							name={id}
							defaultChecked={true}
						/>
						{`${rowType === 'user' ? 'Subalternos' : 'Todos'}`}
					</div>
					<div
						className="changes-filter"
						value={`${rowType === 'user' ? 'Superiores' : 'Propios'}`}
						name="propios"
						onClick={radioClickHandler}
					>
						<input
							type="radio"
							className="changes-radio-icon"
							value={`${rowType === 'user' ? 'Superiores' : 'Propios'}`}
							name={id}
						/>
						{`${rowType === 'user' ? 'Superiores' : 'Propios'}`}
					</div>
				</div>
			);
		}
		return content;
	};

	return (
		<div id={id} style={{ animation: 'bgFadeIn 0.6s ease' }}>
			<div className="changes-filters">
				{typeContent().newButton}
				{typeContent().radioButtons}
				<div className="changes-search-box">
					<div className="changes-search-icon">
						<GrSearch />
					</div>
					<input className="changes-search" placeholder="Buscar" onChange={inputChangeHandler} />
					<div className="changes-search-icon"></div>
				</div>
			</div>
			{listData.filter.length ? (
				<table className="table-change">
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
							{((!userContext.userData.superior && rowType !== 'affected') ||
								(userContext.userData.superior && rowType !== 'request')) && <th>Opciones</th>}
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
				<div className="no-data">
					<Title text={'No hay datos para mostrar.'} />
				</div>
			)}
		</div>
	);
};

export default Table;
