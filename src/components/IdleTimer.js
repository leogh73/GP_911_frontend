import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Modal from './Modal';

const IdleTimer = ({ isLoggedIn }) => {
	const [showModal, setShowModal] = useState(false);
	const [modalRemainingTime, setModalRemainingTime] = useState(15);
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
			setModalRemainingTime(15);
		});

		return () => {
			if (modalTimeout) clearTimeout(modalTimeout);
			window.removeEventListener('mousemove', () => {
				setShowModal(false);
				setModalRemainingTime(15);
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
			}, 1000 * 60 * 5);
		};

		restartAutoReset();

		window.addEventListener('mousemove', restartAutoReset);

		return () => {
			if (idleTimeout) {
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
					body={
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-around',
								alignItems: 'center',
							}}
						>
							<div
								style={{
									fontSize: '17px',
									paddingBottom: '10px',
								}}
							>
								{'Su sesión se cerrará automáticamente en'}
							</div>
							<div style={{ fontSize: '25px' }}>{`${modalRemainingTime} segundos`}</div>
						</div>
					}
					closeText={'Si'}
					closeFunction={() => setShowModal(false)}
					type={'timer'}
				/>
			)}
		</>
	);
};

export default IdleTimer;
