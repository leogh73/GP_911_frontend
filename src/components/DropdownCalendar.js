import Calendar from 'react-calendar';
import { IconContext } from 'react-icons';
import { MdArrowDropDown } from 'react-icons/md';
import { useCallback, useContext, useEffect } from 'react';
import './DropdownCalendar.css';
import 'react-calendar/dist/Calendar.css';
import SendNewContext from '../context/SendNewContext';

const DropdownCalendar = ({ name, icon, titleValue, value, onChange, schedule }) => {
	const sendNewContext = useContext(SendNewContext);

	const toggleMenu = useCallback(() => {
		document
			.getElementById(name)
			.querySelector('.calendar-component')
			.classList.toggle(schedule ? 'active-search' : 'active');
		document.getElementById(name).querySelector('.dropdown-arrow').classList.toggle('active');
		if (schedule) {
			document.getElementById(name).querySelector('.react-calendar').classList.toggle('search');
		}
	}, [name, schedule]);

	const selectedOption = () => {
		document
			.getElementById(name)
			.querySelector('.calendar-dropdown-button')
			.classList.add('selected');
	};

	useEffect(() => {
		if (
			!!sendNewContext.openedMenu &&
			sendNewContext.openedMenu !== name &&
			document
				.getElementById(name)
				.querySelector('.calendar-component')
				.classList.contains('active')
		)
			toggleMenu();
	}, [sendNewContext.openedMenu, name, toggleMenu]);

	return (
		<IconContext.Provider
			value={{ style: { color: 'slategray', backgroundColor: 'none', minWidth: '20px' } }}
		>
			<div id={name} className="calendar-wrapper" tabIndex={0}>
				<div
					className="calendar-dropdown-button"
					onClick={() => {
						toggleMenu();
						sendNewContext.loadOpenedMenu(name);
					}}
				>
					<div className="calendar-icon">{icon}</div>
					<div className="calendar-title">
						{!!titleValue && <div className="section-title">{titleValue}</div>}
						{value}
					</div>
					<div className="dropdown-arrow">
						<MdArrowDropDown size={22} />
					</div>
				</div>
				<div className="calendar-component" style={{ top: '58px' }}>
					<Calendar
						onChange={(date) => {
							toggleMenu();
							selectedOption();
							onChange(date);
						}}
					/>
				</div>
			</div>
		</IconContext.Provider>
	);
};

export default DropdownCalendar;
