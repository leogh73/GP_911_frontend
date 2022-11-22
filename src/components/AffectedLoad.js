import Title from './Title';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import './ChangeLoad.css';
import useAffectedLoad from '../hooks/useAffectedLoad';
import { ToastContainer } from 'react-toastify';
import Modal from './Modal';
import Button from './Button';
import { GoRequestChanges } from 'react-icons/go';
import SelectDate from './SelectDate';
import { FaUser, FaUserClock } from 'react-icons/fa';
import SelectUser from './SelectUser';

const AffectedLoad = ({ sendResult }) => {
	const [showModal, setShowModal] = useState(false);
	const { state, loadUser, loadDate, dataIsValid, loadingSendChange, sendNewChange } =
		useAffectedLoad(sendResult);

	return (
		<div className="new-change">
			<Title icon={<FaUserClock />} text={'Nuevo afectado'} />
			<div className="user-section">
				<div className="user-section-content">
					<SelectUser
						name="affected"
						icon={<FaUser size={20} />}
						titleValue="Personal"
						sendSelectedUser={loadUser}
					/>
				</div>
			</div>
			<div className="new-change-data">
				<div className="user-change-section">
					<SelectDate
						name="affected"
						titles={['Fecha afectado', 'Horario afectado', 'Día afectado', 'Guardia afectado']}
						sendSelectedData={loadDate}
					/>
				</div>
				<div className="user-change-section">
					<SelectDate
						name="disaffected"
						titles={[
							'Fecha desafectado',
							'Horario desafectado',
							'Día desafectado',
							'Guardia desafectado',
						]}
						sendSelectedData={loadDate}
					/>
				</div>
			</div>
			<Button
				className="button"
				text={'ENVIAR'}
				width={200}
				disabled={!dataIsValid}
				loading={loadingSendChange}
				onClick={() => setShowModal(true)}
			/>
			{showModal && (
				<Modal
					id="change-modal"
					title="Confirmar"
					body={`¿Enviar cambios de servicio para ${state.name}?`}
					closeText={'No'}
					closeFunction={() => setShowModal(false)}
					actionFunction={sendNewChange}
				/>
			)}
			<ToastContainer />
		</div>
	);
};

export default AffectedLoad;
