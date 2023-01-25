import { useCallback, useContext, useEffect, useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import './Button.css';
import './Dropdown.css';
import SendNewContext from '../context/SendNewContext';

const DropdownMenu = ({ name, icon, value, titleValue, optionsList, onChange, style }) => {
	const sendNewContext = useContext(SendNewContext);
	const [listState, setListState] = useState(optionsList);

	const toggleMenu = useCallback(() => {
		document.getElementById(name).querySelector('.dropdown-content').classList.toggle('active');
		document.getElementById(name).querySelector('.dropdown-arrow').classList.toggle('active');
	}, [name]);

	const selectedOption = () => {
		document.getElementById(name).querySelector('.dropdown-button').classList.add('selected');
	};

	const clickOptionHandler = (e) => {
		let newList = [...optionsList];
		newList.splice(
			optionsList.findIndex((option) => option === e.target.getAttribute('value')),
			1,
		);
		setListState(newList);
		onChange(e);
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
					toggleMenu();
					sendNewContext.loadOpenedMenu(name);
				}}
			>
				{icon && <div className="dropdown-icon">{icon}</div>}
				<div className="dropdown-text">
					<div className="dropdown-title" style={{ fontSize: `${style.fontSize}` }}>
						{!!titleValue && <div className="section-title">{titleValue}</div>}
						{value}
					</div>
					<div className="dropdown-arrow">
						<MdArrowDropDown size={22} />
					</div>
				</div>
			</div>
			<div style={style && style} className="dropdown-content">
				{listState.map((option, i) => {
					return (
						<div
							key={i}
							name={name}
							style={{ fontSize: `${style.fontSize}` }}
							className="dropdown-option"
							value={option}
							onClick={(e) => {
								toggleMenu();
								selectedOption();
								clickOptionHandler(e);
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

export default DropdownMenu;
