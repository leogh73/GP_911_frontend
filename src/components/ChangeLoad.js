import { useContext, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer } from 'react-toastify';
import { FaUser, FaExchangeAlt, FaEdit } from 'react-icons/fa';
import Modal from './Modal';
import UserContext from '../context/UserContext';
import Button from './Button';
import SelectDate from './SelectDate';
import SelectList from './SelectList';
import Title from './Title';
import useChangeLoad from '../hooks/useChangeLoad';
import './ChangeLoad.css';
import SendNewContext from '../context/SendNewContext';

const ChangeLoad = ({ sendResult, startData }) => {
	const context = useContext(UserContext);
	const [openedMenu, setOpenedMenu] = useState('');
	const [showModal, setShowModal] = useState(false);
	const { state, loadDate, loadUser, dataIsValid, loadingSendChange, sendNewChange } =
		useChangeLoad(sendResult, startData);

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

	console.log();

	return (
		<SendNewContext.Provider
			value={{
				openedMenu,
				loadOpenedMenu,
			}}
		>
			<div className="new-change">
				{startData ? (
					<Title icon={<FaEdit />} text={'Editar cambio'} />
				) : (
					<Title icon={<FaExchangeAlt />} text={'Nuevo cambio'} />
				)}
				<div className="new-change-data">
					<div className="user-change-section">
						{startData
							? changeSection(
									'01',
									<SelectList
										name="cover"
										type="users"
										icon={<FaUser size={20} />}
										titleValue="Quien cubre"
										sendSelectedItem={loadUser}
										startData={startData ? startData.coverData : null}
									/>,
							  )
							: changeSection(
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
							startData={startData ? startData.coverData : null}
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
								startData={startData ? startData.returnData : null}
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
							startData={startData ? startData.returnData : null}
						/>
					</div>
				</div>
				<Button
					className="button"
					text={startData ? 'EDITAR' : 'ENVIAR'}
					width={200}
					disabled={!dataIsValid}
					loading={loadingSendChange}
					onClick={() => setShowModal(true)}
				/>
				{showModal && (
					<Modal
						id="modalChange"
						title={'Confirmar'}
						body={
							startData
								? '¿Editar cambio? Si modifica el usuario que cubre, sólo ese usuario podrá volver a editarlo.'
								: `¿Enviar nuevo cambio con ${state.returnData.name}?`
						}
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
