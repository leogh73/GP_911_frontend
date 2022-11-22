import { useState, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import useHttpConnection from './useHttpConnection';

// let sessionLogoutTime;

const useUser = () => {
	const [firstName, setFirstName] = useState();
	const [lastName, setLastName] = useState();
	const [guardId, setGuardId] = useState();
	const [superior, setSuperior] = useState();
	const [token, setToken] = useState();
	// const [expirationTokenTime, setExpirationTokenTime] = useState(false);
	// const { httpRequestHandler } = useHttpConnection();

	// const navigate = useNavigate();

	const storeUser = (firstName, lastName, guardId, superior) => {
		localStorage.setItem(
			'userData',
			JSON.stringify({
				firstName,
				lastName,
				guardId,
				superior,
			}),
		);
	};

	const storeToken = (renew, token, expirationDate) => {
		if (renew) localStorage.removeItem('userToken');
		localStorage.setItem(
			'userToken',
			JSON.stringify({
				token: token,
				expirationDate: expirationDate.toISOString(),
			}),
		);
	};

	const login = useCallback(
		(token, firstName, lastName, guardId, superior, expirationTokenTime) => {
			setToken(token);
			setFirstName(firstName);
			setLastName(lastName);
			setGuardId(guardId);
			setSuperior(superior);
			const expirationDateToken =
				expirationTokenTime || new Date(new Date().getTime() + 1000 * 60 * 59);
			// setExpirationTokenTime(expirationDateToken);
			storeUser(firstName, lastName, guardId, superior);
			storeToken(false, token, expirationDateToken);
		},
		[],
	);

	const logout = (expiredSession) => {
		setToken(null);
		setFirstName(null);
		setLastName(null);
		setGuardId(null);
		setSuperior(null);
		// setExpirationTokenTime(null);
		if (expiredSession) toast('Por su seguridad, vuelva a iniciar sesión.', { type: 'warning' });
		localStorage.removeItem('userData');
		localStorage.removeItem('userToken');
	};

	// const renewToken = useCallback(async () => {
	// 	try {
	// 		let renovation = await httpRequestHandler(
	// 			'http://localhost:5000/api/user/renewtoken',
	// 			'POST',
	// 			{},
	// 			{
	// 				authorization: `Bearer ${token}`,
	// 			},
	// 		);
	// 		setToken(null);
	// 		setExpirationTokenTime(null);
	// 		const newExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 59);
	// 		setToken(token);
	// 		setExpirationTokenTime(newExpirationDate);
	// 		storeToken(true, renovation.token, newExpirationDate);
	// 	} catch (error) {
	// 		logout(true);
	// 		console.log(error);
	// 	}
	// }, [httpRequestHandler, token, logout, storeToken]);

	// useEffect(() => {
	// 	if (token && expirationTokenTime) {
	// 		const remainingTime = expirationTokenTime.getTime() - new Date().getTime();
	// 		sessionLogoutTime = setTimeout(async () => await renewToken(), remainingTime);
	// 	} else {
	// 		clearTimeout(sessionLogoutTime);
	// 	}
	// }, [token, expirationTokenTime, renewToken]);

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
				storedUserData.firstName,
				storedUserData.lastName,
				storedUserData.guardId,
				storedUserData.superior,
				new Date(storedTokenData.expirationDate),
			);
		}
	}, [login]);

	return {
		token,
		firstName,
		lastName,
		guardId,
		superior,
		login,
		logout,
	};
};

export default useUser;
