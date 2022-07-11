import React, { useContext, useState, useCallback } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { toast, ToastContainer } from 'react-toastify';
import UsuarioContext from '../context/UserContext';
import useHttpConnection from '../hooks/useHttpConnection';
import Loading from './Loading';
import Modal from './Modal';

const Change = ({ change, resultModifyChange }) => {
	const [loading, setLoading] = useState();

	const idAccordion = Math.floor(Math.random() * 1000);
	const { httpRequestHandler } = useHttpConnection();

	const context = useContext(UsuarioContext);

	const loadSection = (header, sectionList, data) => {
		let sectionData = [];
		for (let i = 0; sectionList.length > i; i++) {
			let section = {};
			const idSectionPart = (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');
			section['seccion'] = sectionList[i];
			section['dato'] = data[i];
			section['key'] = idSectionPart;
			sectionData.push(section);
		}

		return (
			<div className="bg-light mb-3 section-change">
				<div className="col mt-3">
					{header ? (
						<div>
							<strong>
								<div className="col text-center">{header}</div>
							</strong>
							<hr className="my-3 title-section-change" />
						</div>
					) : (
						''
					)}
					<div className="row row-cols-4  mt-3">
						{sectionData.map((parteSeccion) => {
							return (
								<div className="col mb-3" key={parteSeccion.key}>
									<div className="row mb-1 justify-content-center text-center text-secondary">
										{parteSeccion.seccion}
									</div>
									<div className="row justify-content-center text-center">{parteSeccion.dato}</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	};

	const loadButtons = () => {
		const idModalCancel = (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');
		const idModalAnnul = (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');
		const idModalApprove = (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');
		const idModalNotAppove = (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');

		const generateModalButton = (buttonText, idModal, title, body, actionFunction) => {
			return (
				<div className="col">
					<div className="mb-1 mt-1 text-center">
						<button
							style={{ width: 180 }}
							className={'btn mybtn tx-tfm shadow-none'}
							data-bs-target={`#${idModal}`}
							data-bs-toggle="modal"
						>
							{buttonText}
						</button>
					</div>
					<Modal id={idModal} title={title} body={body} actionFunction={actionFunction} />
				</div>
			);
		};

		if (
			!context.superior &&
			context.fullName === change.returnName &&
			change.status === 'Solicitado'
		)
			return (
				<div className="row mb-2 mt-2 justify-content-around">
					{generateModalButton(
						'CANCELAR',
						idModalCancel,
						'Confirmar cancelar cambio',
						`¿Cancelar cambio con ${change.coverName}?`,
						() => modifyChange('cancelar', change._id),
					)}
				</div>
			);

		if (context.superior && change.status === 'Solicitado')
			return (
				<div className="row mb-2 mt-2 justify-content-around">
					{generateModalButton(
						'APROBAR',
						idModalApprove,
						'Confirmar aprobar cambio',
						`¿Aprobar cambio entre ${change.returnName} y ${change.coverName}?`,
						() => modifyChange('aprobar', change._id),
					)}
					{generateModalButton(
						'NO APROBAR',
						idModalNotAppove,
						'Confirmar no aprobar cambio',
						`¿No aprobar cambio entre ${change.returnName} y ${change.coverName}?`,
						() => modifyChange('noaprobar', change._id),
					)}
				</div>
			);

		if (context.superior && change.status.startsWith('Aprobado'))
			return (
				<div className="row mb-2 mt-2 justify-content-around">
					{generateModalButton(
						'ANULAR',
						idModalAnnul,
						'Confirmar anular cambio',
						`¿Anular cambio entre ${change.returnName} y ${change.coverName}?`,
						() => modifyChange('anular', change._id),
					)}
				</div>
			);
	};

	const modifyChange = useCallback(
		async (action, changeId) => {
			let url = '';
			let body = {};
			if (!context.superior) {
				url = 'http://localhost:5000/api/changes/cancel';
				body.changeId = changeId;
			}
			if (context.superior) {
				url = 'http://localhost:5000/api/changes/modify';
				body.action = action;
				body.changeId = changeId;
				body.fullName = context.fullName;
			}

			try {
				setLoading(true);
				let consult = await httpRequestHandler(url, 'POST', JSON.stringify(body), {
					authorization: `Bearer ${context.token}`,
					'Content-type': 'application/json',
				});
				setLoading(false);
				resultModifyChange(action, consult);
			} catch (error) {
				toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
				console.log(error);
			}
		},
		[httpRequestHandler, context, resultModifyChange],
	);

	return (
		<div className="accordion-item">
			<LoadingOverlay
				active={loading}
				styles={{
					overlay: (base) => ({
						...base,
						background: 'rgba(255, 255, 255, 0.4)',
					}),
				}}
				spinner={<Loading />}
			>
				<h2 className="accordion-header" id={`#panelsStayOpen-${idAccordion}`}>
					<button
						className={`accordion-button ${
							context.fullName === change.returnName ? 'boton-change' : ''
						} collapsed`}
						type="button"
						data-bs-toggle="collapse"
						data-bs-target={`#panelsStayOpen-${idAccordion}`}
						aria-expanded="false"
						aria-controls={`panelsStayOpen-${idAccordion}`}
					>
						<div className="container">
							<div className="row row-cols-4 text-center">
								<div className="col">{change.startDate}</div>
								<div className="col">{change.returnName}</div>
								<div className="col">{change.coverName}</div>
								<div className="col">{change.status}</div>
							</div>
						</div>
					</button>
				</h2>
				<div
					id={`panelsStayOpen-${idAccordion}`}
					className="accordion-collapse collapse"
					aria-labelledby="panelsStayOpen-headingThree"
				>
					<div className="accordion-body m-2">
						<div className="d-flex justify-content-center row">
							{loadSection(
								'Solicitud',
								['Fecha', 'Día', 'Quien devuelve', 'Quien cubre'],
								[change.startDate, change.startDay, change.returnName, change.coverName],
							)}

							{loadSection(
								change.returnName,
								['Fecha', 'Día', 'Horario', 'Guardia'],
								[
									change.returnResult.date,
									change.returnResult.day,
									change.returnResult.shift,
									change.returnResult.guardId,
								],
							)}

							{loadSection(
								change.coverName,
								['Fecha', 'Día', 'Horario', 'Guardia'],
								[
									change.coverResult.date,
									change.coverResult.day,
									change.coverResult.shift,
									change.coverResult.guardId,
								],
							)}

							<div className="col bg-light mb-2 section-change">
								<strong>
									<div className="row mb-3 mt-3 justify-content-center">{change.status}</div>
								</strong>
							</div>
							{loadButtons()}
						</div>
					</div>
				</div>
			</LoadingOverlay>
			<ToastContainer />
		</div>
	);
};

export default Change;
