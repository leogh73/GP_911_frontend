import { useCallback, useContext, useEffect } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import './Button.css';
import './Dropdown.css';
import SendNewContext from '../context/SendNewContext';

const DropdownMenu = ({ name, icon, value, titleValue, optionsList, onChange, style }) => {
	const context = useContext(SendNewContext);

	const toggleMenu = useCallback(() => {
		document.getElementById(name).querySelector('.dropdown-content').classList.toggle('active');
		document.getElementById(name).querySelector('.dropdown-arrow').classList.toggle('active');
	}, [name]);

	const selectedOption = () => {
		document.getElementById(name).querySelector('.dropdown-button').classList.add('selected');
	};

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
				{optionsList.map((option, i) => {
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
								onChange(e);
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
