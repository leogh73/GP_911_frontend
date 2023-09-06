import React, { useState, useCallback, useEffect, useContext } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

import Loading from '../components/Loading';
import Message from '../components/Message';
import ScheduleTable from '../components/ScheduleTable';

import './Schedule.css';

import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';
import DropdownCalendar from '../components/DropdownCalendar';
import { BsCalendarDate } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import Button from '../components/Button';

const Schedule = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [dataList, setDataList] = useState();
	const userContext = useContext(UserContext);
	const { httpRequestHandler } = useHttpConnection();
	const [selectedDate, setSelectedDate] = useState(null);
	const [calendarKey, setCalendarkey] = useState(Math.floor(Math.random() * 1000));

	const dateHandler = (date) =>
		`${date.getDate().toString().padStart(2, 0)}/${(date.getMonth() + 1)
			.toString()
			.padStart(2, 0)}/${date.getFullYear()}`;

	const fetchData = useCallback(async () => {
		try {
			let consult;
			if (!selectedDate) {
				consult = await httpRequestHandler('spreadsheet/month', 'POST', JSON.stringify({}), {
					authorization: `Bearer ${userContext.token}`,
				});
			} else {
				consult = await httpRequestHandler(
					'spreadsheet/search',
					'POST',
					JSON.stringify({ date: selectedDate }),
					{
						authorization: `Bearer ${userContext.token}`,
						'Content-type': 'Application/json',
					},
				);
			}
			if (consult.error) {
				setError(true);
				if (consult.error === 'Not authorized') {
					userContext.logout(true);
				}
				return;
			}
			setDataList(consult);
			if (consult.newAccessToken) {
				const newUserData = { ...userContext.userData, token: consult.newAccessToken };
				userContext.login(newUserData);
			}
		} catch (error) {
			console.log(error);
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, selectedDate, userContext]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const toggleCalendar = () => {
		const calendarClassList = document
			.getElementById('schedule-calendar')
			.querySelector('.calendar-component').classList;
		if (calendarClassList.contains('active-search')) calendarClassList.toggle('active-search');
		const arrowClassList = document.querySelector('.dropdown-arrow').classList;
		if (arrowClassList.contains('active')) arrowClassList.toggle('active');
	};

	return (
		<div className="changes-list">
			<div className="schedule-search-container">
				<div key={'01'} className="user-section-schedule-search">
					<div className="user-section-content">
						<DropdownCalendar
							key={calendarKey}
							name={'schedule-calendar'}
							icon={<BsCalendarDate size={20} />}
							titleValue={'Buscar fecha'}
							value={selectedDate ?? 'Seleccionar'}
							onChange={(date) => {
								setError(false);
								setLoading(true);
								setSelectedDate(dateHandler(new Date(date)));
								toggleCalendar();
							}}
							schedule={true}
						/>
					</div>
				</div>
				<div className="schedule-close-button-container">
					<div style={{ paddingRight: '10px' }}>
						<Button
							width={60}
							height={60}
							icon={<MdClose size={32} />}
							disabled={selectedDate ? false : true}
							onClick={() => {
								setError(false);
								setLoading(true);
								setSelectedDate(null);
								setCalendarkey(Math.floor(Math.random() * 1000));
								toggleCalendar();
							}}
						/>
					</div>
				</div>
			</div>
			{
				<>
					{error ? (
						<div className="loading-error-change">
							<Message
								title={`Error cargando ${
									userContext.state.activeTab === '/schedule/month' ? 'cronograma' : 'datos'
								}`}
								icon={<FaExclamationTriangle />}
								body={`No se pudieron cargar ${
									userContext.state.activeTab === '/schedule/month'
										? 'turnos'
										: 'datos de búsqueda'
								}. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas.`}
							/>
						</div>
					) : loading ? (
						<div className="spinner-container-change">
							<Loading type={'closed'} />
						</div>
					) : (
						<>
							<div style={{ animation: 'bgFadeIn 0.6s ease' }} className={'table-schedule-week'}>
								{dataList.splittedSchedule.map((week) => (
									<ScheduleTable key={Math.random() * 1000} splitted={true} data={week} />
								))}
							</div>
							<div style={{ animation: 'bgFadeIn 0.6s ease' }} className={'table-schedule-full'}>
								<ScheduleTable
									key={Math.random() * 1000}
									splitted={false}
									data={dataList.fullSchedule}
								/>
							</div>
						</>
					)}
				</>
			}
		</div>
	);
};

export default Schedule;
