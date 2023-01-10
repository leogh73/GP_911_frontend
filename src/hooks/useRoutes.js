import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import List from '../pages/List';
import { useState } from 'react';
import ChangeEdit from '../pages/ChangeEdit';
import NewItem from '../pages/NewItem';
import Changes from '../pages/Changes';
import Affected from '../pages/Affected';

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
				<Route path="/changes/agreed" element={<Changes />} />
				<Route path="/changes/requested" element={<Changes />} />
				<Route path="/changes/*" element={<NotFound />} />
			</Route>
			<Route path="/affected" element={<Affected />} />
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
