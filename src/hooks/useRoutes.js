import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import AllChanges from '../pages/AllChanges';
import Register from '../pages/Register';
import ChangeNew from '../pages/ChangeNew';
import NotFound from '../pages/NotFound';

const useRoutes = (token, superior) => {
	const routes = token ? (
		<Routes>
			<Route path="/" element={<AllChanges />} />
			<Route path="/changes" element={<AllChanges />} />
			<Route from="/" element={<Navigate replace to="/changes" />} />
			<Route path="*" element={<NotFound />} />
			{superior ? (
				<Route path="/register" element={<Register />} />
			) : (
				<Route path="/new" element={<ChangeNew />} />
			)}
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
