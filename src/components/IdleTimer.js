import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Modal from './Modal';

const IdleTimer = ({ isLoggedIn }) => {
	const [showModal, setShowModal] = useState(false);
	const [modalRemainingTime, setModalRemainingTime] = useState(10);
	const navigate = useNavigate();
	const userContext = useContext(UserContext);

	useEffect(() => {
		if (modalRemainingTime === 0) {
			setShowModal(false);
			setModalRemainingTime(10);
			userContext.logout(true);
			navigate('/');
		}

		let modalTimeout = null;
		if (showModal) {
			modalTimeout = setTimeout(() => {
				setModalRemainingTime(modalRemainingTime - 1);
			}, 1000);
		}

		window.addEventListener('mousemove', () => {
			setShowModal(false);
			setModalRemainingTime(10);
		});

		return () => {
			console.log('clear modal timeout');
			if (modalTimeout) clearTimeout(modalTimeout);
			window.removeEventListener('mousemove', () => {
				setShowModal(false);
				setModalRemainingTime(10);
			});
		};
	}, [modalRemainingTime, showModal, userContext, navigate]);

	useEffect(() => {
		if (!isLoggedIn) return;

		let idleTimeout = null;
		const restartAutoReset = () => {
			if (idleTimeout) clearTimeout(idleTimeout);
			idleTimeout = setTimeout(() => {
				setShowModal(true);
			}, 1000 * 10);
		};

		restartAutoReset();

		window.addEventListener('mousemove', restartAutoReset);

		return () => {
			if (idleTimeout) {
				console.log('clear idle timeout');
				clearTimeout(idleTimeout);
				window.removeEventListener('mousemove', restartAutoReset);
			}
		};
	}, [isLoggedIn]);

	return (
		<>
			{showModal && (
				<Modal
					id="login-error"
					title={'¿Sigue allí?'}
					body={`Su sesión se cerrará automáticamente en ${modalRemainingTime} segundos`}
					closeText={'Si'}
					closeFunction={() => setShowModal(false)}
				/>
			)}
		</>
	);
};

export default IdleTimer;
