import { IconContext } from 'react-icons';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DropdownCalendar.css';
import { MdArrowDropDown } from 'react-icons/md';
import { BsCalendar2DateFill, BsCalendarDate } from 'react-icons/bs';
import { useEffect } from 'react';

const DropdownCalendar = ({ name, icon, titleValue, value, onChange }) => {
	const toggleMenu = () => {
		document.getElementById(name).querySelector('.calendar-component').classList.toggle('active');
		document.getElementById(name).querySelector('.dropdown-arrow').classList.toggle('active');
	};

	const selectedOption = () => {
		document
			.getElementById(name)
			.querySelector('.calendar-dropdown-button')
			.classList.add('selected');
	};

	return (
		<IconContext.Provider
			value={{ style: { color: 'slategray', backgroundColor: 'none', minWidth: '20px' } }}
		>
			<div id={name} className="calendar-wrapper" tabIndex={0}>
				<div className="calendar-dropdown-button" onClick={toggleMenu}>
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
