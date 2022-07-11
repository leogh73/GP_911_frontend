import React from 'react';

function ChangeComment() {
	return (
		<div className="container bg-light mb-3 seccion-cambio">
			<div className="justify-content-center row mt-2 mb-2">
				<div className="col-md-12">
					<div className="col mt-1 mb-1 text-center">Comentarios</div>

					<div className="d-flex flex-column">
						<div className="comentario bg-white m-2">
							<div className="row row-cols-2 m-3">
								<div className="col-md-3">
									<div className="row">Barraza Imhoff María Noemí</div>
									<div className="row text-black-50">10/11/20222</div>
									<div className="row text-black-50">16:48 hs.</div>
								</div>
								<div className="col-6 col-md-9">
									<div className="row m-lg-0">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
										incididunt ut labore et dolore magna aliqua.
									</div>
								</div>
							</div>
							<div></div>
							{/* <div className="d-flex flex-row user-info m-3">
								<div className="d-flex flex-column justify-content-start">
									<span className="d-block font-weight-bold name">Emilce Machado</span>
									<span className="text-black-50">10/11/20222 - 16:48 hs.</span>
								</div>
								<div className="col pl-2">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
									incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
									nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
								</div>
							</div> */}
						</div>
						<div className="bg-light p-2">
							<input className="form-control ml-1 shadow-none" />
							<div className="mt-2 text-end">
								<button className="btn btn-secondary  btn-sm shadow-none" type="button">
									Agregar comentario
								</button>
								<span className="m-1"></span>
								<button
									className="btn btn-outline-secondary btn-sm ml-1 shadow-none"
									type="button"
								>
									Cancelar
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChangeComment;
