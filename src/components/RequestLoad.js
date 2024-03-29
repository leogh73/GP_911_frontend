import Title from './Title';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import './ChangeLoad.css';
import useRequestLoad from '../hooks/useRequestLoad';
import { ToastContainer } from 'react-toastify';
import Modal from './Modal';
import Button from './Button';
import { GoRequestChanges } from 'react-icons/go';
import SelectDate from './SelectDate';
import SendNewContext from '../context/SendNewContext';
import { BiCommentDetail } from 'react-icons/bi';

const RequestLoad = ({ sendResult }) => {
	const [openedMenu, setOpenedMenu] = useState('');
	const [showModal, setShowModal] = useState(false);
	const { state, dispatch, loadDate, sendNewChange } = useRequestLoad(sendResult);

	const loadOpenedMenu = (id) => setOpenedMenu(id);

	const commentChangeHandler = (e) => {
		dispatch({ type: 'load comment', payload: { comment: e.target.value } });
	};

	return (
		<SendNewContext.Provider
			value={{
				openedMenu,
				loadOpenedMenu,
			}}
		>
			<div className="new-form">
				<Title icon={<GoRequestChanges />} text={'Nuevo pedido'} />
				<div className="new-change-data">
					<div className="user-change-section">
						<SelectDate
							name="request"
							titles={['Fecha pedida', 'Horario pedido', 'Día pedido', 'Guardia pedida']}
							sendSelectedData={loadDate}
						/>
					</div>
					<div className="user-change-section">
						<SelectDate
							name="offer"
							titles={[
								'Fecha ofrecida (opcional)',
								'Horario ofrecido (opcional)',
								'Día ofrecido (opcional)',
								'Guardia ofrecida (opcional)',
							]}
							sendSelectedData={loadDate}
						/>
					</div>
				</div>
				<div key={'01'} className="user-section">
					<div className="user-section-content">
						<div className="section-icon">
							<BiCommentDetail />
						</div>
						<div className="section-text">
							<div className="section-title">{'Comentario (opcional)'}</div>
							<div className="comment-load">
								<input
									name={'comment-load'}
									id={'03_comment'}
									onChange={commentChangeHandler}
									value={state.data.comment}
								/>
							</div>
						</div>
					</div>
				</div>
				<Button
					className="button"
					text={'ENVIAR'}
					width={200}
					disabled={!state.dataIsValid}
					loading={state.loading}
					onClick={() => setShowModal(true)}
				/>
				{showModal && (
					<Modal
						id="change-modal"
						texts={{
							title: 'Confirmar nuevo pedido',
							body: `¿Enviar nuevo pedido para el ${state.data.requestData.date}?`,
							close: 'No',
							comment: false,
						}}
						functions={{ action: sendNewChange, close: () => setShowModal(false) }}
					/>
				)}
				<ToastContainer />
			</div>
		</SendNewContext.Provider>
	);
};

// const changeSection = (key, content, icon, title, data) => (
// 	<div key={key} className="user-section">
// 		<div className="user-section-content">
// 			{content ? (
// 				content
// 			) : (
// 				<>
// 					<div className="section-icon">{icon}</div>
// 					<div className="section-text">
// 						<div className="section-title">{title}</div>
// 						{data}
// 					</div>
// 				</>
// 			)}
// 		</div>
// 	</div>
// );

// const loadCalendar = (name, icon, titleValue, value, onChange) => (
// 	<DropdownCalendar
// 		name={name}
// 		icon={icon}
// 		titleValue={titleValue}
// 		value={value}
// 		onChange={onChange}
// 	/>
// );

// const loadDropdown = (
// 	name,
// 	icon,
// 	titleValue,
// 	value,
// 	optionsLIst,
// 	onChange,
// 	style,
// 	section,
// 	fetchingOptions,
// 	inputHandler,
// ) => (
// 	<DropdownMenu
// 		name={name}
// 		icon={icon}
// 		titleValue={titleValue}
// 		value={value}
// 		optionsList={optionsLIst}
// 		onChange={onChange}
// 		style={style}
// 		section={section}
// 		fetchingOptions={fetchingOptions}
// 		inputHandler={inputHandler}
// 	/>
// );

// const formData = {
// 	section1: [
// 		{
// 			key: '01',
// 			content: loadCalendar(
// 				'request-date',
// 				<BsCalendarDate size={20} />,
// 				'Fecha pedida',
// 				state.requestData.date !== '-' ? state.requestData.date : 'Seleccionar',
// 				(date) => loadDateGuards(date, 'request'),
// 			),
// 		},
// 		{
// 			key: '02',
// 			content: loadDropdown(
// 				'request-date-select',
// 				<IoMdTime size={22} />,
// 				'Horario pedido',
// 				state.requestData.shift !== '-' ? state.requestData.shift : 'Seleccionar',
// 				['6 a 14 hs.', '14 a 22 hs.', '22 a 6 hs.'],
// 				(e) => loadShift('cover', e.target.getAttribute('value')),
// 				{ top: '76px', padding: '5px' },
// 			),
// 		},
// 		{
// 			key: '03',
// 			title: 'Día pedido',
// 			icon: <FaCalendarDay />,
// 			data: state.requestData.day,
// 		},
// 		{
// 			key: '04',
// 			title: 'Guardia pedida',
// 			icon: <FaUsers />,
// 			data: state.requestData.guardId,
// 		},
// 	],
// 	section2: [
// 		{
// 			key: '04',
// 			content: loadCalendar(
// 				'offer-date',
// 				<BsCalendarDate size={20} />,
// 				'Fecha ofrecida',
// 				state.offerData.date !== '-' ? state.coverData.date : 'Seleccionar',
// 				(date) => loadDateGuards(date, 'offer'),
// 			),
// 		},
// 		{
// 			key: '05',
// 			content: loadDropdown(
// 				'offer-date-select',
// 				<IoMdTime size={22} />,
// 				'Horario ofrecido',
// 				state.offerData.shift !== '-' ? state.offerData.shift : 'Seleccionar',
// 				['6 a 14 hs.', '14 a 22 hs.', '22 a 6 hs.'],
// 				(e) => loadShift('cover', e.target.getAttribute('value')),
// 				{ top: '76px', padding: '5px' },
// 			),
// 		},
// 		{
// 			key: '06',
// 			title: 'Día ofrecido',
// 			icon: <FaCalendarDay />,
// 			data: state.offerData.day,
// 		},
// 		{
// 			key: '07',
// 			title: 'Guardia ofrecida',
// 			icon: <FaUsers />,
// 			data: state.offerData.guardId,
// 		},
// 	],
// };

export default RequestLoad;
