import { useState, useCallback, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useUser = (setNavBarState) => {
	const [token, setToken] = useState();
	const [userData, setUserData] = useState();
	const [loading, setLoading] = useState();
	const { httpRequestHandler } = useHttpConnection();
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
			if (!expiredSession) {
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
					return;
				} else {
					return toast('No se pudo completar el proceso.', { type: 'error' });
				}
			}
			setToken(null);
			setUserData(null);
			setNavBarState({ isLoggedIn: false, isAdmin: false });
			return toast('Por su seguridad, vuelva a iniciar sesión.', { type: 'warning' });
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
		refreshSession();
	}, [refreshSession]);

	return {
		token,
		userData,
		login,
		logout,
		loading,
	};
};

export default useUser;
