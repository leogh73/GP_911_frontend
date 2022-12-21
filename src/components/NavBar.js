import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { IconContext } from 'react-icons';
import {
	FaRegCalendarAlt,
	FaList,
	FaUserClock,
	FaUserPlus,
	FaUserAlt,
	FaUserCircle,
	FaKey,
	FaSignOutAlt,
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { FiSun, FiMoon } from 'react-icons/fi';
import UserContext from '../context/UserContext';
import './NavBar.css';

const NavBar = () => {
	const context = useContext(UserContext);
	const navigate = useNavigate();

	const logout = () => {
		context.logout(false);
		navigate('/');
	};

	useEffect(() => {
		const burger = document.querySelector('.burger');
		const navLinks = document.querySelector('.nav-links');
		const layout = document.querySelector('.layout');
		const userMenu = context.token ? document.querySelector('.user-toggle') : null;
		const navLinksList = document.querySelectorAll('.nav-links li');

		const toggleNavBar = () => {
			navLinks.classList.toggle('nav-active');
			navLinksList.forEach((link, index) => {
				if (link.style.animation === '') {
					link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.4}s`;
				} else link.style.animation = '';
				link.addEventListener('click', () => {
					if (navLinks.classList.contains('nav-active')) toggleNavBar();
				});
			});
			burger.classList.toggle('toggle');
			layout.classList.toggle('body-overlay');
		};

		if (context.token) {
			burger.addEventListener('click', () => {
				toggleNavBar();
				if (userMenu.classList.contains('active')) userMenu.classList.toggle('active');
			});
			userMenu.addEventListener('click', () => {
				userMenu.classList.toggle('active');
				if (navLinks.classList.contains('nav-active')) toggleNavBar();
				layout.classList.add('background');
			});
			layout.addEventListener('click', () => {
				if (navLinks.classList.contains('nav-active')) toggleNavBar();
				if (userMenu.classList.contains('active')) userMenu.classList.toggle('active');
			});
		}

		const body = document.querySelector('body');
		const modeToggle = document.querySelector('.dark-light');

		if (localStorage.getItem('mode') === null) {
			localStorage.setItem('mode', 'light-mode');
		} else if (localStorage.getItem('mode') === 'dark-mode') {
			body.classList.add('dark');
			modeToggle.classList.toggle('active');
		}
		modeToggle.addEventListener('click', () => {
			modeToggle.classList.toggle('active');
			body.classList.toggle('dark');
			body.classList.contains('dark')
				? localStorage.setItem('mode', 'dark-mode')
				: localStorage.setItem('mode', 'light-mode');
		});

		return () => {
			if (context.token) {
				userMenu.removeEventListener('click', () => {});
				burger.removeEventListener('click', () => {
					navLinks.classList.toggle('nav-links');
				});
				layout.removeEventListener('click', () => {
					if (navLinks.classList.value === 'nav-links nav-active') toggleNavBar();
				});
				modeToggle.removeEventListener('click', () => {});
				navLinksList.forEach((link) =>
					link.removeEventListener('click', () =>
						navLinks.classList.contains('nav-active') ? toggleNavBar() : null,
					),
				);
			}
		};
	}, [context.token]);

	const modeButton = () => (
		<>
			<div className="dark-light">
				<div className="sun-icon">
					<FiSun size={25} />
				</div>
				<div className="moon-icon">
					<FiMoon size={25} />
				</div>
			</div>
		</>
	);

	const linkClickHandler = (e) => {
		let id = e.target.getAttribute('href');
		let links = document.querySelectorAll('.link-container');
		links.forEach((link) => link.classList.remove('clicked'));
		document.getElementById(id).querySelector('.link-container').classList.add('clicked');
	};

	return (
		<IconContext.Provider
			value={{
				style: { marginRight: '12px', marginBottom: '3px' },
			}}
		>
			<nav className="nav">
				<div className="logo">
					<h4>Guardias 911</h4>
				</div>
				{context.token ? (
					<>
						<ul className="nav-links" onClick={linkClickHandler}>
							<li id={'/schedule'}>
								<div className="link-container">
									<Link to="/schedule">
										<FaRegCalendarAlt />
										CRONOGRAMA
									</Link>
								</div>
							</li>
							<li id={'/changes'}>
								<div className="link-container clicked">
									<Link to="/changes">
										<FaList />
										CAMBIOS
									</Link>
								</div>
							</li>{' '}
							<li id={'/affected'}>
								<div className="link-container">
									<Link to="/affected">
										<FaUserClock />
										AFECTADOS/DESAFECTADOS
									</Link>
								</div>
							</li>
							{context.superior && (
								<li id={'/register'}>
									<div className="link-container">
										<Link to="/register">
											<FaUserPlus />
											NUEVO USUARIO
										</Link>
									</div>
								</li>
							)}
						</ul>
						{modeButton()}
						<div className="user-toggle">
							<div className="user-close">
								<IoMdClose size={25} />
							</div>
							<div className="user-open">
								<FaUserAlt size={23} />
							</div>
							<div className="user-menu">
								<h3 className="user-header">
									<FaUserCircle size={32} />
									<div className="user-name">{`${context.firstName} ${context.lastName}`}</div>
								</h3>
								<Link className="user-link" to="/changepassword">
									<FaKey />
									Cambiar contraseña
								</Link>
								<Link
									className="user-link"
									to="/"
									onClick={logout}
									// data-bs-target={`#exampleModal`}
									// data-bs-toggle="modal"
								>
									<FaSignOutAlt />
									Cerrar sesión
								</Link>
							</div>
						</div>

						<div className="burger">
							<div className="line1"></div>
							<div className="line2"></div>
							<div className="line3"></div>
						</div>
					</>
				) : (
					modeButton()
				)}
			</nav>
		</IconContext.Provider>
	);
};

export default NavBar;
