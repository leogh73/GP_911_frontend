import React, { useState, useCallback, useEffect, useContext } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import Message from '../components/Message';
import Table from '../components/Table';
import SectionContext from '../context/SectionContext';

import UserContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';

import './Changes.css';

const Users = ({ section }) => {
	const { httpRequestHandler } = useHttpConnection();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [dataList, setDataList] = useState();
	const userContext = useContext(UserContext);
	const navigate = useNavigate();
	const location = useLocation();

	const fetchListItems = useCallback(async () => {
		try {
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/user/allusers',
				'POST',
				JSON.stringify({ section }),
				{ authorization: `Bearer ${userContext.token}`, 'Content-type': 'application/json' },
			);
			if (consult.error) {
				setError(true);
				if (consult.error === 'Token expired') {
					userContext.logout(true);
					navigate('/');
				}
				return;
			}
			setDataList(consult.allUsers);
		} catch (error) {
			console.log(error);
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, section, userContext, navigate]);

	useEffect(() => {
		fetchListItems();
	}, [fetchListItems]);

	useEffect(() => {
		let tabs = document.querySelectorAll('.tab');
		let element = document.getElementById(location.pathname);
		tabs.forEach((tab) => tab.classList.remove('selected'));
		if (!element?.classList.contains('selected')) element.classList.add('selected');
	}, [location.pathname]);

	const tabClickHandler = (e) => {
		let elementId = e.target.getAttribute('id');
		let elementUrl = e.target.getAttribute('href');
		let url = !!elementId ? elementId : elementUrl;
		if (!!url && url !== location.pathname) {
			navigate(url);
			setDataList(null);
			setLoading(true);
			setError(false);
		}
	};

	const phoningId = '/users/phoning';
	const monitoringId = '/users/monitoring';
	const dispatchId = '/users/dispatch';

	return (
		<SectionContext.Provider
			value={{
				section: section,
			}}
		>
			<div className="changes-list">
				<div className="tabs-container" onClick={tabClickHandler}>
					<div className="tabs-list">
						<div className="tab" id={phoningId} index={0}>
							<Link to={phoningId}>Telefonía</Link>
						</div>
						<div className="tab" id={dispatchId} index={1}>
							<Link to={dispatchId}>Despacho</Link>
						</div>
						<div className="tab" id={monitoringId} index={2}>
							<Link to={monitoringId}>Monitoreo</Link>
						</div>
					</div>
				</div>
				{error ? (
					<div className="loading-error-change">
						<Message
							title={'Error cargando usuarios'}
							icon={<FaExclamationTriangle />}
							body={'No se pudieron cargar usuarios. Intente nuevamente más tarde.'}
						/>
					</div>
				) : loading ? (
					<div className="spinner-container-change">
						<Loading type={'closed'} />
					</div>
				) : (
					<Table
						id={Math.random() * 10000}
						headersList={[
							{ key: 0, title: 'Apellido' },
							{ key: 1, title: 'Nombre' },
							{ key: 2, title: 'NI' },
							{ key: 3, title: 'Jerarquía' },
							{ key: 4, title: 'Guardia' },
							{ key: 5, title: 'Usuario' },
							{ key: 6, title: 'Correo electrónico' },
						]}
						rowType={'user'}
						dataList={dataList}
						newLink={`/register/${section.toLowerCase()}`}
					/>
				)}
			</div>
		</SectionContext.Provider>
	);
};

export default Users;
