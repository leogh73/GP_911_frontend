import { useCallback, useEffect } from 'react';
import './Modal.css';
import { IoMdClose } from 'react-icons/io';
import Button from './Button';
import { FaExclamationTriangle } from 'react-icons/fa';
import Title from './Title';

const Modal = ({
	id,
	clickComponent,
	title,
	body,
	actionFunction,
	closeText,
	closeFunction,
	loginError,
}) => {
	const openModal = useCallback(() => {
		document.getElementById(id).classList.add('active');
		document.getElementById(id).style.animation = 'bgFadeIn 0.4s ease forwards';
		document.getElementById(id).querySelector('.modal-content').style.animation =
			'modalFadeIn 0.4s ease forwards';
	}, [id]);

	const closeModal = () => {
		setTimeout(() => {
			if (closeFunction != null) closeFunction();
			document.getElementById(id).classList.remove('active');
		}, 300);
		document.getElementById(id).querySelector('.modal-content').style.animation =
			'modalFadeOut 0.4s ease forwards';
		document.getElementById(id).style.animation = 'bgFadeOut 0.4s ease forwards';
	};

	useEffect(() => {
		if (clickComponent == null) openModal();
	}, [clickComponent, openModal]);

	return (
		<>
			<div style={{ maxWidth: '8.2em' }} onClick={openModal}>
				{clickComponent}
			</div>

			<div
				id={id}
				className="modal-bg"
				onClick={(e) => {
					if (e.target.className === `modal-bg active`) closeModal();
				}}
			>
				<div className="modal-content">
					{loginError ? (
						<div
							style={{
								height: '210px',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-around',
								alignItems: 'center',
							}}
						>
							<Title text={title} icon={<FaExclamationTriangle />} />
							<p style={{ paddingBottom: '10px' }}>{body}</p>
							<Button text={'CERRAR'} width={250} onClick={closeModal} />
						</div>
					) : (
						<>
							<div className="modal-header">
								<h5 className="modal-title">{title}</h5>
								<IoMdClose style={{ cursor: 'pointer' }} size={25} onClick={closeModal} />
							</div>
							<p className="modal-divider" />
							<div className="modal-body">{body}</div>
							<p className="modal-divider" />
							<div className="modal-footer">
								{actionFunction != null && (
									<div className="modal-btn">
										<Button width={120} text="Si" onClick={actionFunction} />
									</div>
								)}
								<div className="modal-btn">
									<Button width={120} text={closeText} onClick={closeModal} />
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
};

// const Modal = ({ titulo, body, boton1, boton2, onClick1, onClick2 }) => (
// 	<div
// 		className="modal"
// 		id="exampleModal"
// 		tabIndex="-1"
// 		aria-labelledby="exampleModalLabel"
// 		aria-hidden="true"
// 	>
// 		<div className="modal-dialog">
// 			<div className="modal-content">
// 				<div className="modal-header">
// 					<h5 className="modal-title" id="exampleModalLabel">
// 						{titulo}
// 					</h5>
// 					<button
// 						type="button"
// 						className="btn-close"
// 						data-bs-dismiss="modal"
// 						aria-label="Close"
// 					></button>
// 				</div>
// 				<div className="modal-body">{body}</div>
// 				<div className="modal-footer">
// 					<button
// 						type="button"
// 						className="btn btn-secondary"
// 						data-bs-dismiss="modal
//             on
//             "
// 						onClick={onClick1}
// 					>
// 						{boton1}
// 					</button>
// 					<button type="button" className="btn btn-primary" onClick={onClick2}>
// 						{boton2}
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	</div>
// );

export default Modal;
