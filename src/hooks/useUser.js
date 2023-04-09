import { useState, useCallback, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';
import NavBar from '../components/NavBar';

const useUser = (setNavBar) => {
	const [token, setToken] = useState();
	const [userData, setUserData] = useState();
	const [loading, setLoading] = useState();
	const { httpRequestHandler } = useHttpConnection();
	const userContext = useContext(UserContext);

	const login = (userData) => {
		setToken(userData.token);
		setUserData(userData);
		setNavBar(<NavBar token={userData.token} key={userData.token} />);
	};

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

					return;
				} else {
					return toast('No se pudo completar el proceso.', { type: 'error' });
				}
			}
			setToken(null);
			setUserData(null);
			setNavBar(<NavBar token={null} key={'01'} />);
			return toast('Por su seguridad, vuelva a iniciar sesión.', { type: 'warning' });
		},
		[httpRequestHandler, userContext.token, setNavBar],
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
			if (!response.error) {
				setToken(response.token);
				setUserData(response);
				setNavBar(<NavBar token={response.token} key={response.token} />);
			}
		} catch (error) {
			logout(true);
		} finally {
			setLoading(false);
		}
	}, [httpRequestHandler, logout, setNavBar]);

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
