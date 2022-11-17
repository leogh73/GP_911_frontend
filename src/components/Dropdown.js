import './Dropdown.css';
import { MdArrowDropDown } from 'react-icons/md';
import { GoSearch } from 'react-icons/go';
import { useEffect } from 'react';
import { css } from '@emotion/react';
import { MoonLoader } from 'react-spinners';
import './Button.css';
import { IconContext } from 'react-icons';

const DropdownMenu = ({
	name,
	icon,
	value,
	titleValue,
	optionsList,
	onChange,
	fetchingOptions,
	section,
	style,
	inputHandler,
}) => {
	const toggleMenu = () => {
		document.getElementById(name).querySelector('.dropdown-content').classList.toggle('active');
		document.getElementById(name).querySelector('.dropdown-arrow').classList.toggle('active');
	};

	const selectedOption = () => {
		document.getElementById(name).querySelector('.dropdown-button').classList.add('selected');
	};

	const override = css`
		margin: 0;
		display: center;
	`;

	return (
		<div id={name} className="dropdown-wrapper" tabIndex={1}>
			<div
				className="dropdown-button"
				// style={{ padding: `${style.padding}` }}
				onClick={toggleMenu}
			>
				{icon && <div className="dropdown-icon">{icon}</div>}
				<div className="dropdown-text">
					<div className="dropdown-title" style={{ fontSize: `${style.fontSize}` }}>
						{!!titleValue && <div className="section-title">{titleValue}</div>}
						{value}
					</div>
					{fetchingOptions ? (
						<MoonLoader color={'black'} css={override} size={18} />
					) : (
						<div className="dropdown-arrow">
							<MdArrowDropDown size={22} />
						</div>
					)}
				</div>
			</div>
			<div style={style && style} className="dropdown-content">
				{section && (
					<div className="dropdown-input-box">
						<div className="dropdown-input-icon">
							<GoSearch />
						</div>
						<input
							className="dropdown-input"
							placeholder="Buscar"
							onChange={(e) => inputHandler(section, e.target.value)}
						/>
					</div>
				)}
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
