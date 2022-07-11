import { useState, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useHttpConnection from './useHttpConnection';

let sessionLogoutTime;

const useUser = () => {
	const [fullName, setName] = useState();
	const [guardId, setGuardId] = useState();
	const [superior, setSuperior] = useState();
	const [token, setToken] = useState();
	const [expirationTokenTime, setExpirationTokenTime] = useState(false);
	const { httpRequestHandler } = useHttpConnection();
	const [userGuards, setUserGuards] = useState({});

	// const navigate = useNavigate();

	const storeUser = useCallback((fullName, guardId, superior, userGuards) => {
		localStorage.setItem(
			'userData',
			JSON.stringify({
				fullName: fullName,
				guardId: guardId,
				superior: superior,
				userGuards: userGuards,
			}),
		);
	}, []);

	const storeToken = useCallback((renew, token, expirationDate) => {
		if (renew) localStorage.removeItem('userToken');
		localStorage.setItem(
			'userToken',
			JSON.stringify({
				token: token,
				expirationDate: expirationDate.toISOString(),
			}),
		);
	}, []);

	const login = useCallback(
		(token, fullName, guardId, superior, userGuards, expirationTokenTime) => {
			setToken(token);
			setName(fullName);
			setGuardId(guardId);
			setSuperior(superior);
			setUserGuards(userGuards);
			const expirationDateToken =
				expirationTokenTime || new Date(new Date().getTime() + 1000 * 60 * 59);
			setExpirationTokenTime(expirationDateToken);
			storeUser(fullName, guardId, superior, userGuards);
			storeToken(false, token, expirationDateToken);
		},
		[storeUser, storeToken],
	);

	const logout = useCallback((expiredSession) => {
		setToken(null);
		setName(null);
		setGuardId(null);
		setSuperior(null);
		setUserGuards({});
		setExpirationTokenTime(null);
		if (expiredSession) toast('Por su seguridad, vuelva a iniciar sesión.', { type: 'warning' });
		localStorage.removeItem('userData');
		localStorage.removeItem('userToken');
	}, []);

	const renewToken = useCallback(async () => {
		try {
			let renovation = await httpRequestHandler(
				'http://localhost:5000/api/user/renewtoken',
				'POST',
				{},
				{
					authorization: `Bearer ${token}`,
				},
			);
			setToken(null);
			setExpirationTokenTime(null);
			const newExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 59);
			setToken(token);
			setExpirationTokenTime(newExpirationDate);
			storeToken(true, renovation.token, newExpirationDate);
		} catch (error) {
			logout(true);
			console.log(error);
		}
	}, [httpRequestHandler, token, logout, storeToken]);

	useEffect(() => {
		if (token && expirationTokenTime) {
			const remainingTime = expirationTokenTime.getTime() - new Date().getTime();
			sessionLogoutTime = setTimeout(async () => await renewToken(), remainingTime);
		} else {
			clearTimeout(sessionLogoutTime);
		}
	}, [token, expirationTokenTime, renewToken]);

	useEffect(() => {
		const storedUserData = JSON.parse(localStorage.getItem('userData'));
		const storedTokenData = JSON.parse(localStorage.getItem('userToken'));
		if (
			storedUserData &&
			storedTokenData &&
			storedTokenData.token &&
			new Date(storedTokenData.expirationDate) > new Date()
		) {
			login(
				storedTokenData.token,
				storedUserData.fullName,
				storedUserData.guardId,
				storedUserData.superior,
				storedUserData.userGuards,
				new Date(storedTokenData.expirationDate),
			);
		}
	}, [login]);

	return {
		token,
		fullName,
		guardId,
		superior,
		userGuards,
		login,
		logout,
	};
};

export default useUser;
