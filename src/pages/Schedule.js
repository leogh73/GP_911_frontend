import React, { useState, useCallback, useEffect, useContext } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';
import ScheduleWeekTable from '../components/ScheduleWeekTable';
import Table from '../components/Table';

import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';

import '../pages/Changes';

const Schedule = ({ type }) => {
	const { httpRequestHandler } = useHttpConnection();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [dataList, setDataList] = useState();
	const userContext = useContext(UserContext);
	const navigate = useNavigate();
	const location = useLocation();

	const fetchData = useCallback(async () => {
		try {
			let consult = await httpRequestHandler(
				`http://localhost:5000/api/spreadsheet/${type}`,
				'GET',
				null,
				{ authorization: `Bearer ${userContext.token}` },
			);
			if (consult.error) return setError(true);
			setDataList(consult);
		} catch (error) {
			console.log(error);
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, type, userContext.token]);

	useEffect(() => {
		fetchData();
	}, [fetchData, type]);

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
		if (!!url && url !== location.pathname) {
			navigate(url);
			userContext.loadActiveTab(url);
			setDataList(null);
			setLoading(true);
			setError(false);
		}
	};

	const monthId = '/schedule/month';
	const searchId = '/schedule/search';

	console.log(dataList);

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
			{error ? (
				<div className="loading-error-change">
					<Message
						title={`Error cargando ${
							userContext.activeTab === '/schedule/month' ? 'cronograma' : 'buscador'
						}`}
						icon={<FaExclamationTriangle />}
						body={`No se pudieron cargar ${
							userContext.activeTab === '/schedule/month' ? 'turnos' : 'datos de buscador'
						}. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas.`}
					/>
				</div>
			) : loading ? (
				<div className="spinner-container-change">
					<Loading type={'closed'} />
				</div>
			) : (
				<>
					{dataList.schedule.map((week) => (
						<ScheduleWeekTable key={Math.random() * 1000} data={week} />
					))}
				</>
			)}
		</div>
	);
};

export default Schedule;
