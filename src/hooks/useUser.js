import { useState, useCallback, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';
import { useLocation, useNavigate } from 'react-router-dom';

const useUser = (setNavBarState) => {
	const [token, setToken] = useState();
	const [userData, setUserData] = useState();
	const [loading, setLoading] = useState();
	const { httpRequestHandler } = useHttpConnection();
	const location = useLocation();
	const navigate = useNavigate();
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
			let response;
			if (!expiredSession)
				response = await httpRequestHandler('user/logout', 'POST', JSON.stringify({}), {
					authorization: `Bearer ${userContext.token}`,
				});
			setLoading(false);
			setToken(null);
			setUserData(null);
			setNavBarState({ isLoggedIn: false, isAdmin: false });
			navigate('/');
			if (expiredSession)
				return toast('Por su seguridad, vuelva a iniciar sesión.', { type: 'warning' });
			if (!response.message) toast('No se pudo completar el proceso.', { type: 'error' });
		},
		[httpRequestHandler, userContext.token, setNavBarState, navigate],
	);

	const refreshSession = useCallback(async () => {
		try {
			setLoading(true);
			let response = await httpRequestHandler(
				'user/refresh-session',
				'POST',
				JSON.stringify({}),
				{},
			);
			if (response.error) return logout(true);
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
			!location.pathname.startsWith('/forgot-password') &&
			!location.pathname.startsWith('/shared') &&
			location.pathname !== '/'
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
