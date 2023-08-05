import { useContext, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import {
	FaUser,
	FaExchangeAlt,
	FaEdit,
	FaUserClock,
	FaBuilding,
	FaUsers,
	FaCalendarDay,
} from 'react-icons/fa';
import { BiCommentDetail } from 'react-icons/bi';

import 'react-calendar/dist/Calendar.css';
import Modal from './Modal';
import Button from './Button';
import SelectDate from './SelectDate';
import SelectList from './SelectList';
import Title from './Title';

import useChangeLoad from '../hooks/useChangeLoad';
import SendNewContext from '../context/SendNewContext';
import CommentContext from '../context/CommentContext';
import UserContext from '../context/UserContext';

import './ChangeLoad.css';
import { IoMdTime } from 'react-icons/io';
import { BsCalendarDate } from 'react-icons/bs';

const ItemShared = ({ type, data }) => {
	const itemData =
		type === 'change'
			? [
					[{ key: 1, icon: <FaBuilding />, title: 'Sección', data: data.section }],
					[
						{
							key: 2,
							icon: <FaBuilding />,
							title: 'Personal que cubre',
							data: data.coverData.name,
						},
						{
							key: 3,
							icon: <BsCalendarDate />,
							title: 'Fecha a cubrir',
							data: data.coverData.date,
						},
						{ key: 4, icon: <IoMdTime />, title: 'Horario a cubrir', data: data.coverData.shift },
						{ key: 5, icon: <FaCalendarDay />, title: 'Día a cubrir', data: data.coverData.day },
						{ key: 6, icon: <FaUsers />, title: 'Guardia a cubrir', data: data.coverData.guardId },
					],
					[
						{
							key: 7,
							icon: <FaBuilding />,
							title: 'Personal que devuelve',
							data: data.returnData.name,
						},
						{
							key: 8,
							icon: <BsCalendarDate />,
							title: 'Fecha a devolver',
							data: data.returnData.date,
						},
						{
							key: 9,
							icon: <IoMdTime />,
							title: 'Horario a devolver',
							data: data.returnData.shift,
						},
						{
							key: 10,
							icon: <FaCalendarDay />,
							title: 'Día a devolver',
							data: data.returnData.day,
						},
						{
							key: 11,
							icon: <FaUsers />,
							title: 'Guardia a devolver',
							data: data.returnData.guardId,
						},
					],
			  ]
			: [
					[data.name, data.section, data.bookPage],
					[
						data.affectedData.date,
						data.affectedData.day,
						data.affectedData.guardId,
						data.affectedData.shift,
					],
					[
						data.disaffectedData.date,
						data.disaffectedData.day,
						data.disaffectedData.guardId,
						data.disaffectedData.shift,
					],
			  ];

	const changeSection = (key, icon, title, data) => (
		<div key={key} className="user-section">
			<div className="section-icon">{icon}</div>
			<div className="section-text">
				<div className="section-title">{title}</div>
				{data}
			</div>
		</div>
	);

	// useEffect(() => {
	// 	return () => {
	// 		userContext.activateEditionRoute();
	// 	};
	// }, [userContext]);

	return (
		<div className="new-form" style={{ padding: '2em' }}>
			<Title
				icon={type === 'change' ? <FaExchangeAlt /> : <FaUserClock />}
				text={type === 'change' ? 'Cambio de guardia' : 'Personal afectado/desafectado'}
			/>
			<div className="new-change-data">
				{itemData[0].map((d) => changeSection(d.key, d.icon, d.title, d.data))}
				<div className="user-change-section">
					{itemData[1].map((d) => changeSection(d.key, d.icon, d.title, d.data))}
				</div>
				<div className="user-change-section">
					{itemData[2].map((d) => changeSection(d.key, d.icon, d.title, d.data))}
				</div>
			</div>
		</div>
	);
};

export default ItemShared;
