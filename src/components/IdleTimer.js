import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

const IdleTimer = ({ isLoggedIn }) => {
	const navigate = useNavigate();
	const userContext = useContext(UserContext);

	useEffect(() => {
		if (!isLoggedIn) {
			return;
		}

		let timeout = null;
		const restartAutoReset = () => {
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => {
				userContext.logout(true);
				navigate('/');
			}, 1000 * 300);
		};

		restartAutoReset();

		window.addEventListener('mousemove', restartAutoReset);

		return () => {
			if (timeout) {
				clearTimeout(timeout);
				window.removeEventListener('mousemove', restartAutoReset);
			}
		};
	}, [userContext, isLoggedIn, navigate]);

	return <div />;
};

export default IdleTimer;
