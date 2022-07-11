import { IconContext } from 'react-icons';
import { FaExchangeAlt } from 'react-icons/fa';
import Title from './Title';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import Loading from './Loading';
import LoadingOverlay from 'react-loading-overlay';
import useChangeLoad from '../hooks/useChangeLoad';
import Modal from './Modal';
import { ToastContainer } from 'react-toastify';
registerLocale('es', es);

const ChangeLoad = ({ resultSendChange }) => {
	const {
		state,
		selectedDate,
		loadingReturn,
		loadingSendChange,
		loadDateGuards,
		filterUserGuards,
		loadCoverStaff,
		loadCoverGuardData,
		dataIsValid,
		sendNewChange,
	} = useChangeLoad(resultSendChange);

	const loadSection = (header, sections, data) => {
		let sectionData = [];
		for (let i = 0; sections.length > i; i++) {
			let section = {};
			const sectionPartId = (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');
			section.section = sections[i];
			section.value = data[i];
			section.key = sectionPartId;
			sectionData.push(section);
		}

		return (
			<div className="bg-light mb-3 section-cambio">
				<div className="col mt-3">
					{header ? (
						<div>
							<strong>
								<div className="col text-center">{header}</div>
							</strong>
							<hr className="my-3 titulo-section-cambio" />
						</div>
					) : (
						''
					)}
					<div className="row row-cols-4  mt-3">
						{sectionData.map((sectionPart) => {
							return (
								<div className="col mb-3" key={sectionPart.key}>
									<div className="row mb-1 justify-content-center text-center text-secondary">
										{sectionPart.section}
									</div>
									<div className="row justify-content-center text-center">{sectionPart.value}</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	};

	return (
		<IconContext.Provider
			value={{ style: { color: 'slategray', minWidth: '40px', minHeight: '50px' } }}
		>
			<div className="nuevo-cambio">
				<LoadingOverlay
					active={loadingSendChange}
					styles={{
						overlay: (base) => ({
							...base,
							background: 'rgba(255, 255, 255, 0.4)',
						}),
					}}
					spinner={<Loading />}
				>
					<div className="">
						<div className="d-flex justify-content-center row">
							<div>
								<Title texto={'Nuevo cambio'} icono={<FaExchangeAlt />} />
							</div>
							<div className="section-cambio row bg-light mb-3">
								<LoadingOverlay
									active={loadingReturn}
									styles={{
										overlay: (base) => ({
											...base,
											background: 'rgba(255, 255, 255, 0.4)',
										}),
									}}
									spinner={<Loading />}
								>
									<div className="row bg-light mb-3">
										<div className="col mt-2 mb-2">
											<div className="row mb-1 justify-content-center text-secondary">
												Fecha a devolver
											</div>
											<div className="row text-center">
												<div className="col  text-center">
													<DatePicker
														placeholderText="Seleccione fecha"
														className="calendario"
														selected={selectedDate}
														onChange={(date) => loadDateGuards(date)}
														locale="es"
														dateFormat="P"
													/>
												</div>
											</div>
										</div>
										<div className="col mb-2 mt-2">
											<div className="row mb-1  justify-content-center text-secondary">
												Horario a devolver
											</div>
											<div className="text-center">
												<select
													className="lista-personal text-center"
													value={state.consultReturn.selection.shift}
													onChange={(event) => filterUserGuards(event.target.value)}
												>
													<option value="Seleccionar">Seleccionar</option>
													{state.consultReturn.schedule.map((shift) => {
														return (
															<option value={shift} key={Math.random() * 1000}>
																{shift}
															</option>
														);
													})}
												</select>
											</div>
										</div>
									</div>
									<div className="row bg-light mb-3">
										<div className="col mb-1 text-center text-secondary">
											Guardia
											<div className="text-center mb-2"></div>
											<div className="row  justify-content-center">
												{state.consultReturn.selection.guardId}
											</div>
										</div>{' '}
										<div className="col mb-1 text-center text-secondary">
											Personal
											<div className="text-center mb-2"></div>
											<div className="row  justify-content-center">
												{' '}
												<div className="row justify-content-center">
													<select
														className="lista-personal"
														value={state.changeData.cover.employeeName}
														onChange={(event) => loadCoverStaff(event.target.value)}
													>
														<option className="text-center" value="Seleccionar">
															Seleccionar
														</option>
														{state.consultReturn.selection.staff.map((employeeName) => {
															return (
																<option value={employeeName} key={Math.random() * 1000}>
																	{employeeName}
																</option>
															);
														})}
													</select>
												</div>
											</div>
										</div>
									</div>
								</LoadingOverlay>
							</div>
							<div className="section-cambio row bg-light mb-3">
								<div className="row bg-light mb-3">
									<div className="col mt-2">
										<div className="mb-1 selector-cubrir text-secondary">Guardia a cubrir</div>

										<div className="selector-cubrir">
											<select
												className="guardias-cubrir"
												value={state.changeData.cover.resume}
												onChange={(event) => loadCoverGuardData(event.target.value)}
											>
												<option className="seleccionar" value="Seleccionar">
													Seleccionar
												</option>
												{state.consultCover.guardsResume.map((guard) => {
													return (
														<option value={guard} key={Math.random() * 1000}>
															{guard}
														</option>
													);
												})}
											</select>
										</div>
									</div>
								</div>
								{/* </LoadingOverlay> */}
							</div>
							{loadSection(
								null,
								['Fecha', 'Día', 'Quien devuelve', 'Quien cubre'],
								[
									state.changeData.startDate,
									state.changeData.startDay,
									state.changeData.return.employeeName,
									state.changeData.cover.employeeName,
								],
							)}
							{loadSection(
								state.changeData.return.employeeName,
								['Fecha', 'Día', 'Horario', 'Guardia'],
								[
									state.changeData.return.date,
									state.changeData.return.day,
									state.changeData.return.shift,
									state.changeData.return.guardId,
								],
							)}
							{loadSection(
								state.changeData.cover.employeeName,
								['Fecha', 'Día', 'Horario', 'Guardia'],
								[
									state.changeData.cover.date,
									state.changeData.cover.day,
									state.changeData.cover.shift,
									state.changeData.cover.guardId,
								],
							)}
						</div>
						<div className="pt-1 pb-4 text-center">
							<button
								style={{ width: 250 }}
								className={`btn mybtn tx-tfm shadow-none ${dataIsValid ? '' : 'disabled'}`}
								data-bs-target="#modalCambio"
								data-bs-toggle="modal"
							>
								ENVIAR CAMBIO
							</button>
						</div>
					</div>
					<Modal
						id="modalCambio"
						title="Confirmar nuevo cambio"
						body={`¿Enviar nuevo cambio con ${state.changeData.cover.employeeName}?`}
						actionFunction={sendNewChange}
					/>
					{/* <div
					className="modal fade"
					id="modalCambio"
					aria-labelledby="exampleModalLabel"
					aria-hidden="true"
				>
					<div className="modal-dialog modal-dialog-centered ">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel">
									Confirmar nuevo cambio
								</h5>
								<button
									type="button"
									className="btn-close"
									data-bs-dismiss="modal"
									aria-label="Close"
								></button>
							</div>
							<div className="modal-body">{`¿Enviar nuevo cambio con ${state.changeData.cover.staff}?`}</div>
							<div className="modal-footer">
								<Boton ancho={120} texto="No" className="btn mybtn" modal={true} />
								<Boton
									ancho={120}
									texto="Si"
									className="btn mybtn"
									modal={true}
									onClick={sendNewChange}
								/>
							</div>
						</div>
					</div>
				</div> */}
				</LoadingOverlay>
			</div>
			<ToastContainer />
		</IconContext.Provider>
	);
};

export default ChangeLoad;
