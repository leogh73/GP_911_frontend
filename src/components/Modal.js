import React from 'react';
import Button from './Button';

const Modal = ({ id, title, body, actionFunction }) => {
	return (
		<div className="modal fade" id={id} aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered ">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="exampleModalLabel">
							{title}
						</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body">{body}</div>
					<div className="modal-footer">
						<Button
							width={120}
							text="Si"
							className="btn mybtn"
							modal={true}
							onClick={actionFunction}
						/>
						<Button width={120} text="No" className="btn mybtn" modal={true} />
					</div>
				</div>
			</div>
		</div>
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
