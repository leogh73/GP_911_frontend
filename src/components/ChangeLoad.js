import { useContext, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer } from 'react-toastify';
import { FaUser, FaExchangeAlt } from 'react-icons/fa';
import Modal from './Modal';
import UserContext from '../context/UserContext';
import Button from './Button';
import SelectDate from './SelectDate';
import SelectList from './SelectList';
import Title from './Title';
import useChangeLoad from '../hooks/useChangeLoad';
import './ChangeLoad.css';
import SendNewContext from '../context/SendNewContext';

const ChangeLoad = ({ sendResult }) => {
	const context = useContext(UserContext);
	const [openedMenu, setOpenedMenu] = useState('');
	const [showModal, setShowModal] = useState(false);
	const { state, loadDate, loadUser, dataIsValid, loadingSendChange, sendNewChange } =
		useChangeLoad(sendResult);

	const loadOpenedMenu = (id) => setOpenedMenu(id);

	const changeSection = (key, content, icon, title, data) => (
		<div key={key} className="user-section">
			<div className="user-section-content">
				{content ? (
					content
				) : (
					<>
						<div className="section-icon">{icon}</div>
						<div className="section-text">
							<div className="section-title">{title}</div>
							{data}
						</div>
					</>
				)}
			</div>
		</div>
	);

	return (
		<SendNewContext.Provider
			value={{
				openedMenu,
				loadOpenedMenu,
			}}
		>
			<div className="new-change">
				<Title icon={<FaExchangeAlt />} text={'Nuevo cambio'} />
				<div className="new-change-data">
					<div className="user-change-section">
						{changeSection(
							'01',
							null,
							<FaUser />,
							'Quien cubre',
							`${context.lastName} ${context.firstName}`,
						)}
						<SelectDate
							name="cover"
							titles={['Fecha a cubrir', 'Horario a cubrir', 'Día a cubrir', 'Guardia a cubrir']}
							sendSelectedData={loadDate}
						/>
					</div>
					<div className="user-change-section">
						{changeSection(
							'02',
							<SelectList
								name="return"
								type="users"
								icon={<FaUser size={20} />}
								titleValue="Quien devuelve"
								sendSelectedItem={loadUser}
							/>,
						)}
						<SelectDate
							name="return"
							titles={[
								'Fecha a devolver',
								'Horario a devolver',
								'Día a devolver',
								'Guardia a devolver',
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
						id="modalCambio"
						title="Confirmar nuevo cambio"
						body={`¿Enviar nuevo cambio con ${state.returnData.name}?`}
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

export default ChangeLoad;
