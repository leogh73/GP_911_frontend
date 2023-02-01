import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import { useState } from 'react';
import ChangeEdit from '../pages/ChangeEdit';
import NewItem from '../pages/NewItem';
import Changes from '../pages/Changes';
import Affected from '../pages/Affected';
import Schedule from '../pages/Schedule';

const useRoutes = (token, userData) => {
	const [activeEditRoute, setActiveEditRoute] = useState(false);
	const [activeTab, setActiveTab] = useState(null);
	const [changeData, setChangeData] = useState();

	const loadChangeData = (data) => {
		setChangeData(data);
	};

	const activateEditionRoute = () => {
		setActiveEditRoute(true);
	};

	const loadActiveTab = (type) => {
		setActiveTab(type);
	};

	const superiorRoutes = [
		{ key: '01', path: '/register', element: <Register /> },
		{
			key: '02',
			path: '/newaffected',
			element: <NewItem type={'affected'} key={'newaffected'} />,
			// element: <ChangeNew type={'affected'} icon={<FaUserClock />} title={'Nuevo afectado'} />,
			// element: <ChangeNew type={'affected'} icon={<FaUserClock />} title={'Nuevo afectado'} />,
		},
	];
	const userRoutes = [
		{
			key: '01',
			path: '/newchange',
			element: <NewItem type={'change'} key={'newchange'} />,
		},
		{
			key: '02',
			path: '/newrequest',
			element: <NewItem type={'request'} key={'newrequest'} />,
		},
	];

	const routes = token ? (
		<Routes>
			<Route path="/" element={<Navigate to="/changes/agreed" />} />
			<Route path="/changes" element={<Navigate to="/changes/agreed" />} />
			<Route path="/changes">
				<Route path="agreed" element={<Changes type={'change'} />} />
				<Route path="requested" element={<Changes type={'request'} />} />
				{activeEditRoute && <Route path="edit" element={<ChangeEdit changeData={changeData} />} />}
			</Route>
			<Route path="/affected" element={<Affected />} />
			<Route path="/schedule" element={<Navigate to="/schedule/month" />} />
			<Route path="/schedule">
				<Route path="month" element={<Schedule type={'month'} />} />
				<Route path="search" element={<Schedule type={'search'} />} />
			</Route>
			{userData.superior
				? superiorRoutes.map((route) => (
						<Route key={route.key} path={route.path} element={route.element} />
				  ))
				: userRoutes.map((route) => (
						<Route key={route.key} path={route.path} element={route.element} />
				  ))}
			<Route path="*" element={<NotFound />} />
		</Routes>
	) : (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);

	return { routes, activeTab, loadActiveTab, loadChangeData, activateEditionRoute };
};

export default useRoutes;
