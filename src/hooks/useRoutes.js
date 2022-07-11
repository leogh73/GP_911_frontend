import { Route, Routes, Navigate } from 'react-router-dom';
import { useState, useCallback } from 'react';

import Login from '../pages/Login';
import AllChanges from '../pages/AllChanges';
import Register from '../pages/Register';
import ChangeNew from '../pages/ChangeNew';
import ChangeSuccess from '../pages/ChangeSuccess';
import ChangeError from '../pages/ChangeError';
import NotFound from '../pages/NotFound';

const useRoutes = (token, superior) => {
	const [activateAction, setActivateAction] = useState(false);
	const [action, setAction] = useState();

	const loadAction = useCallback((action) => {
		setAction(action);
	}, []);

	const activateActionRoute = useCallback(() => {
		setActivateAction(true);
	}, []);

	const loadRoutes = useCallback(() => {
		let routes;
		if (token) {
			routes = (
				<Routes>
					<Route path="/" element={<AllChanges />} />
					<Route path="/changes" element={<AllChanges />} />
					<Route from="/" element={<Navigate replace to="/cambios" />} />
					<Route path="*" element={<NotFound />} />
					{superior ? (
						<Route path="/register" element={<Register />} />
					) : (
						<Route path="/new" element={<ChangeNew />} />
					)}
					{activateAction ? (
						<>
							<Route path="/success" element={<ChangeSuccess action={action} />} />
							<Route path="/error" element={<ChangeError action={action} />} />
						</>
					) : (
						''
					)}
				</Routes>
			);
		} else {
			routes = (
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			);
		}
		return routes;
	}, [token, superior, activateAction, action]);

	let routes = loadRoutes();

	return { routes, activateActionRoute, loadAction };
};

export default useRoutes;
