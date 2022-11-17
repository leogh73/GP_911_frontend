import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import AllChanges from '../pages/AllChanges';
import Register from '../pages/Register';
import RequestNew from '../pages/RequestNew';
import ChangeNew from '../pages/ChangeNew';
import NotFound from '../pages/NotFound';
import AllAffected from '../pages/AllAffected';
import AffectedList from '../components/AffectedLIst';
import { FaExchangeAlt, FaUserClock } from 'react-icons/fa';
import { GoRequestChanges } from 'react-icons/go';

const useRoutes = (token, superior) => {
	const superiorRoutes = [
		{ key: '01', path: '/register', element: <Register /> },
		{
			key: '02',
			path: '/newaffected',
			element: <ChangeNew />,
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
			<Route path="/" element={<AllChanges />} />
			<Route path="/changes" element={<AllChanges />} />
			<Route path="/affected" element={<AllAffected />} />
			<Route path="*" element={<NotFound />} />
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

	return { routes };
};

export default useRoutes;
