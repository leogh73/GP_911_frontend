import { useCallback, useContext, useEffect } from 'react';
import './Modal.css';
import { IoMdClose } from 'react-icons/io';
import Button from './Button';
import { FaExclamationTriangle } from 'react-icons/fa';
import Title from './Title';
import CommentContext from '../context/CommentContext';

const Modal = ({ id, clickComponent, texts, functions, type }) => {
	const commentContext = useContext(CommentContext);

	const modalContent = () => {
		let content = (
			<>
				<div className="modal-header">
					<h5 className="modal-title">{texts.title}</h5>
					<IoMdClose
						style={{ cursor: 'pointer', color: 'black' }}
						size={25}
						onClick={closeModal}
					/>
				</div>
				<p className="modal-divider" />
				<div className="modal-body">
					<div className={`${type !== 'changelog' ? 'modal-body-padding' : ''}`}>{texts.body}</div>
				</div>
				<p className="modal-divider" />
				{texts.comment && (
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
					{functions.action && (
						<div className="modal-btn">
							<Button
								width={120}
								text="Si"
								onClick={() => {
									functions.action();
									closeModal();
								}}
							/>
						</div>
					)}
					<div className="modal-btn">
						<Button width={120} text={texts.close} onClick={closeModal} />
					</div>
				</div>
			</>
		);

		if (type === 'error')
			content = (
				<div
					style={{
						height: '210px',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-around',
						alignItems: 'center',
					}}
				>
					<Title text={texts.title} icon={<FaExclamationTriangle />} />
					<div style={{ paddingBottom: '10px', textAlign: 'center' }}>{texts.body}</div>
					<Button text={'CERRAR'} width={250} onClick={closeModal} />
				</div>
			);

		if (type === 'timer')
			content = (
				<div
					style={{
						height: '210px',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-around',
						alignItems: 'center',
					}}
				>
					<Title text={texts.title} icon={<FaExclamationTriangle />} />
					{texts.body}
				</div>
			);

		return content;
	};

	const openModal = useCallback(() => {
		document.getElementById(id).classList.add('active');
		document.getElementById(id).style.animation = 'bgFadeIn 0.4s ease forwards';
		document.getElementById(id).querySelector('.modal-content').style.animation =
			'modalFadeIn 0.4s ease forwards';
	}, [id]);

	const closeModal = () => {
		setTimeout(() => {
			if (functions.close) functions.close();
			document.getElementById(id)?.classList.remove('active');
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
				<div className="modal-content">{modalContent()}</div>
			</div>
		</>
	);
};

export default Modal;
