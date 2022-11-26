import './Dropdown.css';
import { MdArrowDropDown } from 'react-icons/md';
import { GoSearch } from 'react-icons/go';
import { css } from '@emotion/react';
import { MoonLoader } from 'react-spinners';
import './Button.css';
import useSelectList from '../hooks/useSelectList';
import { useCallback, useContext, useEffect } from 'react';
import SendNewContext from '../context/SendNewContext';

const SelectList = ({ name, type, icon, titleValue, sendSelectedItem }) => {
	const context = useContext(SendNewContext);
	const { state, loadingUsers, loadItem, inputHandler } = useSelectList(
		name,
		type,
		sendSelectedItem,
	);

	const toggleMenu = useCallback(() => {
		document.getElementById(name).querySelector('.dropdown-content').classList.toggle('active');
		document.getElementById(name).querySelector('.dropdown-arrow').classList.toggle('active');
	}, [name]);

	const selectedOption = () => {
		document.getElementById(name).querySelector('.dropdown-button').classList.add('selected');
	};

	const override = css`
		margin: 0;
		display: center;
	`;

	useEffect(() => {
		if (
			!!context.openedMenu &&
			context.openedMenu !== name &&
			document.getElementById(name).querySelector('.dropdown-content').classList.contains('active')
		)
			toggleMenu();
	}, [context.openedMenu, name, toggleMenu]);

	return (
		<div id={name} className="dropdown-wrapper" tabIndex={1}>
			<div
				className="dropdown-button"
				onClick={() => {
					toggleMenu();
					context.loadOpenedMenu(name);
				}}
			>
				{icon && <div className="dropdown-icon">{icon}</div>}
				<div className="dropdown-text">
					<div className="dropdown-title">
						{!!titleValue && <div className="section-title">{titleValue}</div>}
						{state.selectedItem === '-' ? 'Seleccionar' : state.selectedItem}
					</div>
					{loadingUsers ? (
						<MoonLoader color={'black'} css={override} size={18} />
					) : (
						<div className="dropdown-arrow">
							<MdArrowDropDown size={22} />
						</div>
					)}
				</div>
			</div>
			<div
				style={{ top: '76px', height: '250px', overflowY: 'scroll', padding: '0px' }}
				className="dropdown-content"
			>
				<div className="dropdown-input-box">
					<div className="dropdown-input-icon">
						<GoSearch />
					</div>
					<input
						className="dropdown-input"
						placeholder="Buscar"
						onChange={(e) => inputHandler(e.target.value)}
					/>
				</div>
				{state.filterList.map((option, i) => {
					return (
						<div
							key={i}
							name={name}
							className="dropdown-option"
							value={option}
							onClick={(e) => {
								toggleMenu();
								selectedOption();
								loadItem(e.target.getAttribute('value'));
							}}
						>
							{option}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SelectList;
