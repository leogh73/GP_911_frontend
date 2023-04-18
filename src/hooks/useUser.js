import { useState, useCallback, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';
import { useLocation } from 'react-router-dom';

const useUser = (setNavBarState) => {
	const [token, setToken] = useState();
	const [userData, setUserData] = useState();
	const [loading, setLoading] = useState();
	const { httpRequestHandler } = useHttpConnection();
	const location = useLocation();
	const userContext = useContext(UserContext);

	const login = useCallback(
		(userData) => {
			setToken(userData.token);
			setUserData(userData);
			setNavBarState({
				isLoggedIn: true,
				isAdmin: userData.admin,
			});
		},
		[setNavBarState],
	);

	const logout = useCallback(
		async (expiredSession) => {
			setLoading(true);
			let response = await httpRequestHandler(
				'http://localhost:5000/api/user/logout',
				'GET',
				null,
				{
					authorization: `Bearer ${userContext.token}`,
				},
			);
			setLoading(false);
			if (response.message) {
				setToken(null);
				setUserData(null);
				setNavBarState({ isLoggedIn: false, isAdmin: false });
				if (expiredSession)
					toast('Por su seguridad, vuelva a iniciar sesión.', { type: 'warning' });
			} else {
				return toast('No se pudo completar el proceso.', { type: 'error' });
			}
		},
		[httpRequestHandler, userContext.token, setNavBarState],
	);

	const refreshSession = useCallback(async () => {
		try {
			setLoading(true);
			let response = await httpRequestHandler(
				'http://localhost:5000/api/user/refresh-session',
				'GET',
				null,
				{},
			);
			if (response.error) logout(true);
			if (response.userId) login(response);
		} catch (error) {
			logout(true);
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, logout, login]);

	useEffect(() => {
		if (
			!token &&
			!location.pathname.startsWith('/new-password') &&
			!location.pathname.startsWith('/forgot-password')
		)
			refreshSession();
	}, [refreshSession, token, location.pathname]);

	return {
		token,
		userData,
		login,
		logout,
		loading,
	};
};

export default useUser;
