import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RequestNew from '../pages/RequestNew';
import ChangeNew from '../pages/ChangeNew';
import NotFound from '../pages/NotFound';
import List from '../pages/List';
import AffectedNew from '../pages/AffectedNew';
import { useState } from 'react';
import ChangeEdit from '../pages/ChangeEdit';

const useRoutes = (token, superior) => {
	const [activeEditRoute, setActiveEditRoute] = useState(false);
	const [changeData, setChangeData] = useState();

	const loadChangeData = (data) => {
		setChangeData(data);
	};

	const activateEditionRoute = () => {
		setActiveEditRoute(true);
	};

	const superiorRoutes = [
		{ key: '01', path: '/register', element: <Register /> },
		{
			key: '02',
			path: '/newaffected',
			element: <AffectedNew />,
			// element: <ChangeNew type={'affected'} icon={<FaUserClock />} title={'Nuevo afectado'} />,
			// element: <ChangeNew type={'affected'} icon={<FaUserClock />} title={'Nuevo afectado'} />,
		},
	];
	const userRoutes = [
		{
			key: '01',
			path: '/newchange',
			element: <ChangeNew />,
		},
		{
			key: '02',
			path: '/newrequest',
			element: <RequestNew />,
		},
	];

	const routes = token ? (
		<Routes>
			<Route path="/" element={<List type={'change'} />} />
			<Route path="/changes" element={<List type={'change'} key={'change'} />} />
			<Route path="/affected" element={<List type={'affected'} key={'affected'} />} />
			<Route path="*" element={<NotFound />} />
			{activeEditRoute && <Route path="/edit" element={<ChangeEdit changeData={changeData} />} />}
			{superior
				? superiorRoutes.map((route) => (
						<Route key={route.key} path={route.path} element={route.element} />
				  ))
				: userRoutes.map((route) => (
						<Route key={route.key} path={route.path} element={route.element} />
				  ))}
		</Routes>
	) : (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);

	return { routes, loadChangeData, activateEditionRoute };
};

export default useRoutes;
