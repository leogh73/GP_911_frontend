import { useContext, useState } from 'react';
import Title from './Title';
import 'react-calendar/dist/Calendar.css';
import './ChangeLoad.css';
import { ToastContainer } from 'react-toastify';
import { FaUser, FaExchangeAlt } from 'react-icons/fa';
import DropdownMenu from './Dropdown';
import Modal from './Modal';
import UserContext from '../context/UserContext';
import Button from './Button';
import SelectDate from './SelectDate';

import useChangeLoad from '../hooks/useChangeLoad';
import SelectUser from './SelectUser';

const ChangeLoad = ({ sendResult }) => {
	const context = useContext(UserContext);
	const [showModal, setShowModal] = useState(false);
	const { state, loadDate, loadUser, dataIsValid, loadingSendChange, sendNewChange } =
		useChangeLoad(sendResult);

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
		<div className="new-change">
			<Title icon={<FaExchangeAlt />} text={'Nuevo cambio'} />
			<div className="new-change-data">
				<div className="user-change-section">
					{changeSection('01', null, <FaUser />, 'Quien cubre', context.fullName)}
					<SelectDate
						name="cover"
						items={['Fecha a cubrir', 'Horario a cubrir', 'Día a cubrir', 'Guardia a cubrir']}
						sendSelectedData={loadDate}
					/>
				</div>
				<div className="user-change-section">
					{changeSection(
						'02',
						<SelectUser
							name="return"
							icon={<FaUser size={20} />}
							titleValue="Quien devuelve"
							sendSelectedUser={loadUser}
						/>,
					)}
					<SelectDate
						name="return"
						items={[
							'Fecha a devolver',
							'Horario a devolver',
							'Día a devovler',
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
	);
};

export default ChangeLoad;
