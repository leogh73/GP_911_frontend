import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import useHttpConnection from './useHttpConnection';
import { useNavigate } from 'react-router-dom';

let sessionLogoutTime;

const useUser = () => {
	const [token, setToken] = useState();
	const [userData, setUserData] = useState();
	const [loading, setLoading] = useState();
	const { httpRequestHandler } = useHttpConnection();
	const [expirationTokenTime, setExpirationTokenTime] = useState();
	const navigate = useNavigate();

	const login = (userData, sessionLogoutTime) => {
		setToken(userData.token);
		setUserData(userData);
		const expirationDateToken = sessionLogoutTime || new Date(new Date().getTime() + 1000 * 50);
		setExpirationTokenTime(expirationDateToken);
	};

	const logout = useCallback(
		async (expiredSession) => {
			if (!expiredSession) {
				setLoading(true);
				let response = await httpRequestHandler(
					'http://localhost:5000/api/session/logout',
					'GET',
					null,
					{
						authorization: `Bearer ${token}`,
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
			return toast('Por su seguridad, vuelva a iniciar sesión.', { type: 'warning' });
		},
		[token, httpRequestHandler],
	);

	const refreshSession = useCallback(async () => {
		let response = await httpRequestHandler(
			'http://localhost:5000/api/session/refresh-session',
			'GET',
			null,
			{},
		);
		if (!response.error) {
			setToken(response.token);
			setUserData(response);
			setExpirationTokenTime(new Date(new Date().getTime() + 1000 * 50));
		}
	}, [httpRequestHandler]);

	useEffect(() => {
		refreshSession();
	}, [refreshSession]);

	const refreshToken = useCallback(async () => {
		try {
			let response = await httpRequestHandler(
				'http://localhost:5000/api/session/refresh-token',
				'GET',
				null,
				{},
			);
			setToken(response.accessToken);
			setExpirationTokenTime(new Date(new Date().getTime() + 1000 * 50));
		} catch (error) {
			console.log(error);
			await logout(false);
			navigate('/');
		}
	}, [httpRequestHandler, logout, navigate]);

	useEffect(() => {
		if (!!token && expirationTokenTime) {
			const remainingTime = expirationTokenTime.getTime() - new Date().getTime();
			sessionLogoutTime = setTimeout(async () => await refreshToken(), remainingTime);
		} else {
			clearTimeout(sessionLogoutTime);
		}
	}, [token, expirationTokenTime, refreshToken]);

	return {
		token,
		userData,
		login,
		logout,
		loading,
	};
};

export default useUser;
