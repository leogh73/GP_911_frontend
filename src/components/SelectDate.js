import React from 'react';
import { FaUsers, FaUser, FaCalendarDay, FaExchangeAlt } from 'react-icons/fa';
import { BsCalendar2DateFill, BsCalendarDate, BsCalendarDateFill } from 'react-icons/bs';
import { IoMdTime } from 'react-icons/io';
import { BiTimeFive } from 'react-icons/bi';
import useSelectDate from '../hooks/useSelectDate';
import DropdownCalendar from './DropdownCalendar';
import DropdownMenu from './Dropdown';

const SelectDate = ({ name, items, sendSelectedData }) => {
	const { state, loadDateGuards, loadShift } = useSelectDate(sendSelectedData, name);

	// const loadCalendar = (name, icon, titleValue, value, onChange) => (
	// 	<DropdownCalendar
	// 		name={name}
	// 		icon={icon}
	// 		titleValue={titleValue}
	// 		value={value}
	// 		onChange={onChange}
	// 	/>
	// );

	// const loadDropdown = (
	// 	name,
	// 	icon,
	// 	titleValue,
	// 	value,
	// 	optionsLIst,
	// 	onChange,
	// 	style,
	// 	section,
	// 	fetchingOptions,
	// 	inputHandler,
	// ) => (
	// 	<DropdownMenu
	// 		name={name}
	// 		icon={icon}
	// 		titleValue={titleValue}
	// 		value={value}
	// 		optionsList={optionsLIst}
	// 		onChange={onChange}
	// 		style={style}
	// 		section={section}
	// 		fetchingOptions={fetchingOptions}
	// 		inputHandler={inputHandler}
	// 	/>
	// );

	const changeSection = (key, content, icon, title, data) => (
		<div key={key} className="user-section">
			<div className="user-section-content">
				{content ? (
					content
				) : (
					<>
						<div className="section-icon">{icon}</div>
						<div className="section-text">
							<div className="section-title">{title}</div>
							{data}
						</div>
					</>
				)}
			</div>
		</div>
	);

	const formData = [
		{
			key: items[0],
			content: (
				<DropdownCalendar
					name={items[0]}
					icon={<BsCalendarDate size={20} />}
					titleValue={items[0]}
					value={state.data.date !== '-' ? state.data.date : 'Seleccionar'}
					onChange={(date) => loadDateGuards(date)}
				/>
			),
		},
		{
			key: items[1],
			content: (
				<DropdownMenu
					name={items[1]}
					icon={<IoMdTime size={22} />}
					titleValue={items[1]}
					value={state.data.shift !== '-' ? state.data.shift : 'Seleccionar'}
					optionsList={['6 a 14 hs.', '14 a 22 hs.', '22 a 6 hs.']}
					onChange={(e) => loadShift(e.target.getAttribute('value'))}
					style={{ top: '76px', padding: '5px' }}
				/>
			),
		},
		{
			key: items[2],
			title: items[2],
			icon: <FaCalendarDay />,
			data: state.data.day,
		},
		{
			key: items[3],
			title: items[3],
			icon: <FaUsers />,
			data: state.data.guardId,
		},
	];

	return <>{formData.map((i) => changeSection(i.key, i.content, i.icon, i.title, i.data))}</>;
};

export default SelectDate;
