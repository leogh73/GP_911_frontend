import './Dropdown.css';
import { MdArrowDropDown } from 'react-icons/md';
import { GoSearch } from 'react-icons/go';
import { css } from '@emotion/react';
import { MoonLoader } from 'react-spinners';
import './Button.css';
import useSelectUser from '../hooks/useSelectUser';

const SelectUser = ({ name, icon, titleValue, sendSelectedUser }) => {
	const { state, loadingUsers, loadUser, inputHandler } = useSelectUser(sendSelectedUser, name);

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
			<div className="dropdown-button" onClick={toggleMenu}>
				{icon && <div className="dropdown-icon">{icon}</div>}
				<div className="dropdown-text">
					<div className="dropdown-title">
						{!!titleValue && <div className="section-title">{titleValue}</div>}
						{state.selectedUser === '-' ? 'Seleccionar' : state.selectedUser}
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
				{state.filterUsers.map((option, i) => {
					return (
						<div
							key={i}
							name={name}
							className="dropdown-option"
							value={option}
							onClick={(e) => {
								toggleMenu();
								selectedOption();
								loadUser(e.target.getAttribute('value'));
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

export default SelectUser;
