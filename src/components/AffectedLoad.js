import Title from './Title';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import './ChangeLoad.css';
import useAffectedLoad from '../hooks/useAffectedLoad';
import { ToastContainer } from 'react-toastify';
import Modal from './Modal';
import Button from './Button';
import SelectDate from './SelectDate';
import { FaUser, FaUserClock } from 'react-icons/fa';
import { ImBook } from 'react-icons/im';
import SelectList from './SelectList';
import SendNewContext from '../context/SendNewContext';

const AffectedLoad = ({ sendResult }) => {
	const [openedMenu, setOpenedMenu] = useState('');
	const [showModal, setShowModal] = useState(false);
	const { state, loadItem, loadDate, dataIsValid, loadingSendChange, sendNewChange } =
		useAffectedLoad(sendResult);

	const loadOpenedMenu = (id) => setOpenedMenu(id);

	return (
		<SendNewContext.Provider
			value={{
				openedMenu,
				loadOpenedMenu,
			}}
		>
			<div className="new-change">
				<Title icon={<FaUserClock />} text={'Nuevo afectado'} />
				<div className="new-change-data">
					<div className="user-change-section">
						<div className="user-section">
							<div className="user-section-content">
								<SelectList
									name="affected"
									type="users"
									icon={<FaUser size={20} />}
									titleValue="Personal"
									sendSelectedItem={loadItem}
								/>
							</div>
						</div>
					</div>
					<div className="user-change-section">
						<div className="user-section">
							<div className="user-section-content">
								<SelectList
									name="return"
									type="book-page"
									icon={<ImBook size={20} />}
									titleValue="Foja del Libro de Guardia"
									sendSelectedItem={loadItem}
								/>
							</div>
						</div>
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
		</SendNewContext.Provider>
	);
};

export default AffectedLoad;
