import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { IconContext } from 'react-icons';
import { FaRegCalendarAlt, FaList, FaExchangeAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import UsuarioContext from '../context/usuarioContext';
import Modal from './Modal';

const NavBar = () => {
	const context = useContext(UsuarioContext);
	const navigate = useNavigate();
	const cerrarSesion = () => {
		context.cerrarSesion(false);
		navigate('/');
	};

	return (
		<IconContext.Provider
			value={{
				style: { marginRight: '10px', marginBottom: '3px', minWidth: '19px' },
			}}
		>
			<nav className="navbar navbar-expand-md navbar-dark">
				<div className={`container-fluid ${context.token ? '' : 'justify-content-center'}`}>
					<Link id="titulo-login" className="navbar-brand" to="/">
						Guardias 911
					</Link>
					{context.token ? (
						<button
							className="custom-toggler navbar-toggler"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarSupportedContent"
							aria-controls="navbarSupportedContent"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="nav-link-logo">
								<GiHamburgerMenu />
							</span>
						</button>
					) : (
						''
					)}
					{context.token ? (
						<div className="navbar-collapse justify-content-end" id="navbarSupportedContent">
							<ul className="navbar-nav">
								<li className="nav-item">
									<Link className="nav-link" aria-current="page" to="/cronograma">
										<FaRegCalendarAlt />
										Cronograma
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/cambios">
										<FaList />
										Cambios
									</Link>
								</li>{' '}
								{context.superior ? (
									<li className="nav-item">
										<Link className="nav-link" to="/registro">
											<FaUserPlus />
											Registrar usuario
										</Link>
									</li>
								) : (
									<li className="nav-item">
										<Link className="nav-link" to="/nuevo">
											<FaExchangeAlt />
											Nuevo cambio
										</Link>
									</li>
								)}
								<li className="nav-item">
									<Link
										className="nav-link"
										to="/"
										data-bs-target={`#exampleModal`}
										data-bs-toggle="modal"
									>
										<FaSignOutAlt />
										Cerrar sesión
									</Link>
								</li>
							</ul>
						</div>
					) : (
						''
					)}
				</div>
				<Modal
					id="exampleModal"
					titulo="Cerrar sesión"
					cuerpo="¿Confirma que desea cerrar sesión?"
					funcion={cerrarSesion}
				/>
			</nav>
		</IconContext.Provider>
	);
};

export default NavBar;
