import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

const IdleTimer = ({ token }) => {
	const navigate = useNavigate();
	const userContext = useContext(UserContext);

	useEffect(() => {
		if (!token) {
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
	}, [userContext, token, navigate]);

	return <div />;
};

export default IdleTimer;
