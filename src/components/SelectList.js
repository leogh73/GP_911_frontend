import { MdArrowDropDown } from 'react-icons/md';
import { GoSearch } from 'react-icons/go';
import './Button.css';
import useSelectList from '../hooks/useSelectList';
import { useCallback, useContext, useEffect } from 'react';
import SendNewContext from '../context/SendNewContext';
import Loading from './Loading';
import './Dropdown.css';

const SelectList = ({ name, type, icon, titleValue, sendSelectedItem, startData }) => {
	const sendNewContext = useContext(SendNewContext);
	const { state, loadItem, inputHandler } = useSelectList(name, type, sendSelectedItem, startData);

	const toggleMenu = useCallback(() => {
		document.getElementById(name).querySelector('.dropdown-content').classList.toggle('active');
		document.getElementById(name).querySelector('.dropdown-arrow').classList.toggle('active');
	}, [name]);

	const selectedOption = () => {
		document.getElementById(name).querySelector('.dropdown-button').classList.add('selected');
	};

	useEffect(() => {
		if (
			!!sendNewContext.openedMenu &&
			sendNewContext.openedMenu !== name &&
			document.getElementById(name).querySelector('.dropdown-content').classList.contains('active')
		)
			toggleMenu();
	}, [sendNewContext.openedMenu, name, toggleMenu]);

	return (
		<div id={name} className="dropdown-wrapper" tabIndex={1}>
			<div
				className="dropdown-button"
				onClick={() => {
					if (!state.loading) {
						toggleMenu();
						sendNewContext.loadOpenedMenu(name);
					}
				}}
			>
				{icon && <div className="dropdown-icon">{icon}</div>}
				<div className="dropdown-text">
					<div className="dropdown-title">
						{!!titleValue && <div className="section-title">{titleValue}</div>}
						{state.selectedItem === '-' ? 'Seleccionar' : state.selectedItem}
					</div>
					{state.loading ? (
						<Loading type={'opened'} />
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
