import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { Calendar } from 'react-calendar';
import { FaExclamationTriangle } from 'react-icons/fa';
import { AiOutlineSelect } from 'react-icons/ai';

import Loading from '../components/Loading';
import Message from '../components/Message';
import ScheduleTable from '../components/ScheduleTable';

import './Schedule.css';

import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';

const Schedule = ({ type }) => {
	const { httpRequestHandler } = useHttpConnection();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [dataList, setDataList] = useState();
	const userContext = useContext(UserContext);
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedDate, setSelectedDate] = useState(null);

	const dateHandler = (date) =>
		`${date.getDate().toString().padStart(2, 0)}/${(date.getMonth() + 1)
			.toString()
			.padStart(2, 0)}/${date.getFullYear()}`;

	const fetchData = useCallback(async () => {
		try {
			if (type === 'search' && !selectedDate) return;
			let consult;
			if (type === 'month')
				consult = await httpRequestHandler(
					`http://localhost:5000/api/spreadsheet/month`,
					'GET',
					null,
					{
						authorization: `Bearer ${userContext.token}`,
					},
				);
			if (type === 'search' && !!selectedDate)
				consult = await httpRequestHandler(
					`http://localhost:5000/api/spreadsheet/search`,
					'POST',
					JSON.stringify({ date: selectedDate }),
					{ authorization: `Bearer ${userContext.token}`, 'Content-type': 'Application/json' },
				);
			if (consult.error) {
				setError(true);
				if (consult.error === 'Token expired') {
					userContext.logout(true);
					navigate('/');
				}
				return;
			}
			setDataList(consult);
		} catch (error) {
			console.log(error);
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, selectedDate, type, userContext.token]);

	useEffect(() => {
		fetchData();
	}, [fetchData, type, selectedDate]);

	useEffect(() => {
		let tabs = document.querySelectorAll('.tab');
		let element = document.getElementById(location.pathname);
		tabs.forEach((tab) => tab.classList.remove('selected'));
		if (!element.classList.contains('selected')) element.classList.add('selected');
		userContext.loadActiveTab(location.pathname);
	}, [location.pathname, userContext]);

	const tabClickHandler = (e) => {
		let elementId = e.target.getAttribute('id');
		let elementUrl = e.target.getAttribute('href');
		let url = !!elementId ? elementId : elementUrl;
		console.log(location.pathname);
		if (!!url && url !== location.pathname) {
			navigate(url);
			userContext.loadActiveTab(url);
			if (location.pathname === '/schedule/search') setLoading(true);
			setError(false);
			setSelectedDate(null);
		}
	};

	const monthId = '/schedule/month';
	const searchId = '/schedule/search';

	return (
		<div className="changes-list">
			<div className="tabs-container" onClick={tabClickHandler}>
				<div className="tabs-list">
					<div className="tab" id={monthId} index={0}>
						<Link to={monthId}>Cronograma</Link>
					</div>
					<div className="tab" id={searchId} index={1}>
						<Link to={searchId}>Buscador</Link>
					</div>
				</div>
			</div>
			{
				<>
					{type === 'search' && (
						<div className="schedule-calendar">
							<Calendar
								onChange={(date) => {
									setError(false);
									setLoading(true);
									setSelectedDate(dateHandler(new Date(date)));
								}}
							/>
						</div>
					)}
					{error ? (
						<div className="loading-error-change">
							<Message
								title={`Error cargando ${
									userContext.activeTab === '/schedule/month' ? 'cronograma' : 'datos'
								}`}
								icon={<FaExclamationTriangle />}
								body={`No se pudieron cargar ${
									userContext.activeTab === '/schedule/month' ? 'turnos' : 'datos de búsqueda'
								}. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas.`}
							/>
						</div>
					) : loading ? (
						<div className="spinner-container-change">
							<Loading type={'closed'} />
						</div>
					) : (
						<>
							{userContext.activeTab !== '/schedule/month' && !selectedDate ? (
								<div className="loading-error-change">
									<Message
										title={'Seleccionar fecha'}
										icon={<AiOutlineSelect />}
										body={'Seleccione una fecha para ver el cronograma de trabajo.'}
									/>
								</div>
							) : (
								<>
									<div
										style={{ animation: 'bgFadeIn 0.6s ease' }}
										className={'table-schedule-week'}
									>
										{dataList.splittedSchedule.map((week) => (
											<ScheduleTable key={Math.random() * 1000} splitted={true} data={week} />
										))}
									</div>
									<div
										style={{ animation: 'bgFadeIn 0.6s ease' }}
										className={'table-schedule-full'}
									>
										<ScheduleTable
											key={Math.random() * 1000}
											splitted={false}
											data={dataList.fullSchedule}
										/>
									</div>
								</>
							)}
						</>
					)}
				</>
			}
		</div>
	);
};

export default Schedule;
