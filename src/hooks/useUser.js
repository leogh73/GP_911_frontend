import { useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import useHttpConnection from './useHttpConnection';

// let sessionLogoutTime;

const useUser = () => {
	const [userData, setUserData] = useState();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	// const [expirationTokenTime, setExpirationTokenTime] = useState(false);
	// const { httpRequestHandler } = useHttpConnection();

	// const navigate = useNavigate();

	// const storeUser = (userData) => {
	// 	const {
	// 		userId,
	// 		username,
	// 		firstName,
	// 		lastName,
	// 		ni,
	// 		hierarchy,
	// 		section,
	// 		guardId,
	// 		email,
	// 		superior,
	// 		admin,
	// 	} = userData;
	// 	localStorage.setItem(
	// 		'userData',
	// 		JSON.stringify({
	// 			userId,
	// 			username,
	// 			firstName,
	// 			lastName,
	// 			ni,
	// 			hierarchy,
	// 			section,
	// 			guardId,
	// 			email,
	// 			superior,
	// 			admin,
	// 		}),
	// 	);
	// };

	// const storeToken = (renew, isLoggedIn, expirationDate) => {
	// 	if (renew) localStorage.removeItem('userToken');
	// 	localStorage.setItem(
	// 		'userToken',
	// 		JSON.stringify({
	// 			isLoggedIn: isLoggedIn,
	// 			expirationDate: expirationDate.toISOString(),
	// 		}),
	// 	);
	// };

	const login = useCallback((userData, expirationTokenTime) => {
		setIsLoggedIn(true);
		setUserData(userData);
		// const expirationDateToken =
		// 	expirationTokenTime || new Date(new Date().getTime() + 1000 * 60 * 59);
		// setExpirationTokenTime(expirationDateToken);
		// storeUser(userData);
		// storeToken(false, userData.isLoggedIn, expirationDateToken);
	}, []);

	const logout = (expiredSession) => {
		// setToken(null);
		setUserData(null);
		if (expiredSession) toast('Por su seguridad, vuelva a iniciar sesión.', { type: 'warning' });
		localStorage.removeItem('userData');
		localStorage.removeItem('userToken');
	};

	// const renewToken = useCallback(async () => {
	// 	try {
	// 		let renovation = await httpRequestHandler(
	// 			'http://localhost:5000/api/user/renewisLoggedIn',
	// 			'POST',
	// 			{},
	// 			{
	// 				authorization: `Bearer ${isLoggedIn}`,
	// 			},
	// 		);
	// 		setToken(null);
	// 		setExpirationTokenTime(null);
	// 		const newExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 59);
	// 		setToken(isLoggedIn);
	// 		setExpirationTokenTime(newExpirationDate);
	// 		storeToken(true, renovation.isLoggedIn, newExpirationDate);
	// 	} catch (error) {
	// 		logout(true);
	// 		console.log(error);
	// 	}
	// }, [httpRequestHandler, isLoggedIn, logout, storeToken]);

	// useEffect(() => {
	// 	if (isLoggedIn && expirationTokenTime) {
	// 		const remainingTime = expirationTokenTime.getTime() - new Date().getTime();
	// 		sessionLogoutTime = setTimeout(async () => await renewToken(), remainingTime);
	// 	} else {
	// 		clearTimeout(sessionLogoutTime);
	// 	}
	// }, [isLoggedIn, expirationTokenTime, renewToken]);

	// useEffect(() => {
	// 	const storedUserData = JSON.parse(localStorage.getItem('userData'));
	// 	const storedTokenData = JSON.parse(localStorage.getItem('userToken'));
	// 	if (
	// 		storedUserData &&
	// 		storedTokenData &&
	// 		storedTokenData.isLoggedIn &&
	// 		new Date(storedTokenData.expirationDate) > new Date()
	// 	) {
	// 		const {
	// 			userId,
	// 			username,
	// 			firstName,
	// 			lastName,
	// 			ni,
	// 			hierarchy,
	// 			section,
	// 			guardId,
	// 			email,
	// 			superior,
	// 			admin,
	// 		} = storedUserData;
	// 		const userData = {
	// 			isLoggedIn: storedTokenData.isLoggedIn,
	// 			userId,
	// 			username,
	// 			firstName,
	// 			lastName,
	// 			ni,
	// 			hierarchy,
	// 			section,
	// 			guardId,
	// 			email,
	// 			superior,
	// 			admin,
	// 		};
	// 		login(userData, new Date(storedTokenData.expirationDate));
	// 	}
	// }, [login]);

	return {
		userData,
		isLoggedIn,
		login,
		logout,
	};
};

export default useUser;
