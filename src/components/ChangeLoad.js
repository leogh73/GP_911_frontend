import { IconContext } from 'react-icons';
import Title from './Title';
import { useContext, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import './ChangeLoad.css';
import useChangeLoad from '../hooks/useChangeLoad';
import { ToastContainer } from 'react-toastify';
import DropdownMenu from './Dropdown';
import DropdownCalendar from './DropdownCalendar';
import Modal from './Modal';
import UserContext from '../context/UserContext';

import { FaUsers, FaUser, FaCalendarDay, FaExchangeAlt } from 'react-icons/fa';
import { BsCalendar2DateFill, BsCalendarDate, BsCalendarDateFill } from 'react-icons/bs';
import { IoMdTime } from 'react-icons/io';
import { BiTimeFive } from 'react-icons/bi';
import Button from './Button';

const ChangeLoad = ({ resultSendChange }) => {
	const context = useContext(UserContext);
	const [showModal, setShowModal] = useState(false);
	const {
		state,
		loadingUsers,
		loadUser,
		filterUsers,
		loadDateGuards,
		loadShift,
		dataIsValid,
		loadingSendChange,
		sendNewChange,
	} = useChangeLoad(resultSendChange);

	const changeSection = (icon, title, data, content) => (
		<div className="user-section">
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
			<Title icon={<FaExchangeAlt />} text={'Nuevo Cambio'} />
			<div className="new-change-data">
				<div className="user-change-section">
					{changeSection(<FaUser />, 'Quien cubre', context.fullName)}
					{changeSection(
						null,
						null,
						null,
						<DropdownCalendar
							name="cover-date"
							icon={<BsCalendarDate size={20} />}
							titleValue={'Fecha a cubrir'}
							value={state.coverData.date !== '-' ? state.coverData.date : 'Seleccionar'}
							onChange={(date) => {
								loadDateGuards(date, 'cover');
							}}
						/>,
					)}
					{changeSection(
						null,
						null,
						null,
						<DropdownMenu
							name={'cover-shift-select'}
							icon={<IoMdTime size={22} />}
							value={state.coverData.shift !== '-' ? state.coverData.shift : 'Seleccionar'}
							titleValue={'Horario a cubrir'}
							optionsList={['6 a 14 hs.', '14 a 22 hs.', '22 a 6 hs.']}
							onChange={(e) => loadShift('cover', e.target.getAttribute('value'))}
							style={{ top: '76px', padding: '5px' }}
						/>,
					)}
					{changeSection(<FaCalendarDay />, 'Día a cubrir', state.coverData.day)}
					{changeSection(<FaUsers />, 'Guardia a cubrir', state.coverData.guardId)}
				</div>
				<div className="user-change-section">
					{changeSection(
						null,
						null,
						null,
						<DropdownMenu
							name="return-name"
							icon={<FaUser size={20} />}
							value={state.returnData.name !== '-' ? state.returnData.name : 'Seleccionar'}
							titleValue={'Personal a devolver'}
							optionsList={state.filteredData.returnUsers}
							onChange={(e) => loadUser('return', e.target.getAttribute('value'))}
							section={'return'}
							style={{
								top: '76px',
								height: '250px',
								overflowY: 'scroll',
								padding: '0px',
							}}
							fetchingOptions={loadingUsers}
							inputHandler={filterUsers}
						/>,
					)}{' '}
					{changeSection(
						null,
						null,
						null,
						<DropdownCalendar
							name="return-date"
							icon={<BsCalendarDateFill size={20} />}
							value={state.returnData.date !== '-' ? state.returnData.date : 'Seleccionar'}
							titleValue={'Fecha a devolver'}
							onChange={(date) => {
								loadDateGuards(date, 'return');
							}}
						/>,
					)}
					{changeSection(
						null,
						null,
						null,
						<DropdownMenu
							name="return-shift-select"
							icon={<IoMdTime size={22} />}
							value={state.returnData.shift !== '-' ? state.returnData.shift : 'Seleccionar'}
							titleValue={'Horario a devolver'}
							optionsList={['6 a 14 hs.', '14 a 22 hs.', '22 a 6 hs.']}
							onChange={(e) => loadShift('return', e.target.getAttribute('value'))}
							style={{ top: '76px', padding: '5px' }}
						/>,
					)}
					{changeSection(<FaCalendarDay />, 'Día a devolver', state.returnData.day)}
					{changeSection(<FaUsers />, 'Guardia a devolver', state.returnData.guardId)}
				</div>
			</div>
			<Button
				className="button"
				text={'ENVIAR CAMBIO'}
				width={220}
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
