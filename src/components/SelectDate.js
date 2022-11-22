import React from 'react';
import { FaUsers, FaCalendarDay } from 'react-icons/fa';
import { BsCalendarDate } from 'react-icons/bs';
import { IoMdTime } from 'react-icons/io';
import useSelectDate from '../hooks/useSelectDate';
import DropdownCalendar from './DropdownCalendar';
import DropdownMenu from './Dropdown';

const SelectDate = ({ name, titles, sendSelectedData }) => {
	const { state, loadDateGuards, loadShift } = useSelectDate(sendSelectedData, name);

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
			key: titles[0],
			content: (
				<DropdownCalendar
					name={titles[0]}
					icon={<BsCalendarDate size={20} />}
					titleValue={titles[0]}
					value={state.data.date !== '-' ? state.data.date : 'Seleccionar'}
					onChange={(date) => loadDateGuards(date)}
				/>
			),
		},
		{
			key: titles[1],
			content: (
				<DropdownMenu
					name={titles[1]}
					icon={<IoMdTime size={22} />}
					titleValue={titles[1]}
					value={state.data.shift !== '-' ? state.data.shift : 'Seleccionar'}
					optionsList={['6 a 14 hs.', '14 a 22 hs.', '22 a 6 hs.']}
					onChange={(e) => loadShift(e.target.getAttribute('value'))}
					style={{ top: '76px', padding: '5px' }}
				/>
			),
		},
		{
			key: titles[2],
			title: titles[2],
			icon: <FaCalendarDay />,
			data: state.data.day,
		},
		{
			key: titles[3],
			title: titles[3],
			icon: <FaUsers />,
			data: state.data.guardId,
		},
	];

	return <>{formData.map((i) => changeSection(i.key, i.content, i.icon, i.title, i.data))}</>;
};

export default SelectDate;
