import { useCallback, useContext, useEffect, useState } from 'react';
import './Modal.css';
import { IoMdClose } from 'react-icons/io';
import Button from './Button';
import { FaExclamationTriangle } from 'react-icons/fa';
import Title from './Title';
import CommentContext from '../context/CommentContext';

const Modal = ({
	id,
	clickComponent,
	title,
	body,
	actionFunction,
	closeText,
	closeFunction,
	loginError,
	comment,
}) => {
	const commentContext = useContext(CommentContext);

	const openModal = useCallback(() => {
		document.getElementById(id).classList.add('active');
		document.getElementById(id).style.animation = 'bgFadeIn 0.4s ease forwards';
		document.getElementById(id).querySelector('.modal-content').style.animation =
			'modalFadeIn 0.4s ease forwards';
	}, [id]);

	const closeModal = () => {
		setTimeout(() => {
			if (closeFunction) closeFunction();
			document.getElementById(id).classList.remove('active');
			commentContext.loadComment('');
		}, 300);
		document.getElementById(id).querySelector('.modal-content').style.animation =
			'modalFadeOut 0.4s ease forwards';
		document.getElementById(id).style.animation = 'bgFadeOut 0.4s ease forwards';
	};

	const commentChangeHandler = (e) => {
		commentContext.loadComment(e.target.value);
	};

	useEffect(() => {
		if (!clickComponent) openModal();
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
								<IoMdClose
									style={{ cursor: 'pointer', color: 'black' }}
									size={25}
									onClick={closeModal}
								/>
							</div>
							<p className="modal-divider" />
							<div className="modal-body">{body}</div>
							<p className="modal-divider" />
							{comment && (
								<>
									<div className="comment-modal">
										<input
											name={'comment-modal'}
											id={`${id.slice(0, 4)}`}
											onChange={commentChangeHandler}
											value={commentContext.comment}
											placeholder={'Comentario (opcional)'}
										/>
									</div>
									<p className="modal-divider" />
								</>
							)}
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

export default Modal;
