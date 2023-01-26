import { useContext, useEffect, useState } from 'react';
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
import { BiCommentDetail } from 'react-icons/bi';
import CommentContext from '../context/CommentContext';

const ChangeLoad = ({ sendResult, startData }) => {
	const userContext = useContext(UserContext);
	const commentContext = useContext(CommentContext);
	const [openedMenu, setOpenedMenu] = useState('');
	const [showModal, setShowModal] = useState(false);
	const { state, loadDate, loadUser, dataIsValid, loadingSendData, sendChangeData } =
		useChangeLoad(sendResult, startData);

	const loadOpenedMenu = (id) => setOpenedMenu(id);

	const loadComment = (e) => commentContext.loadComment(e.target.value);

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

	useEffect(() => {
		return () => {
			userContext.activateEditionRoute();
		};
	}, [userContext]);

	console.log(state.coverData.name);
	console.log(state.returnData.name);

	return (
		<SendNewContext.Provider
			value={{
				openedMenu,
				loadOpenedMenu,
				coverUser: state.coverData.name.length ? state.coverData.name : null,
				returnUser: state.returnData.name.length ? state.returnData.name : null,
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
									`${userContext.userData.lastName} ${userContext.userData.firstName}`,
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
				{startData &&
					changeSection(
						'01',
						null,
						<BiCommentDetail />,
						'Comentario (opcional)',
						<div className="comment-load">
							<input
								name={'comment-load'}
								id={'03_comment'}
								onChange={loadComment}
								value={commentContext.comment}
							/>
						</div>,
					)}
				<Button
					className="button"
					text={startData ? 'EDITAR' : 'ENVIAR'}
					width={200}
					disabled={!dataIsValid}
					loading={loadingSendData}
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
						actionFunction={sendChangeData}
					/>
				)}
				<ToastContainer />
			</div>
		</SendNewContext.Provider>
	);
};

export default ChangeLoad;
