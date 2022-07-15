import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { IconContext } from 'react-icons';
import {
	FaRegCalendarAlt,
	FaList,
	FaExchangeAlt,
	FaUserPlus,
	FaUserAlt,
	FaPalette,
	FaSignOutAlt,
} from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import UserContext from '../context/UserContext';
import './NavBar.css';
import Modal from './Modal';

const NavBar = () => {
	const context = useContext(UserContext);
	const sideBarActive = useRef(false);
	const navigate = useNavigate();
	const [darkMode, setDarkMode] = useState(
		localStorage.getItem('mode') == 'dark-mode' ? true : false,
	);
	const logout = () => {
		context.logout(false);
		navigate('/');
	};

	useEffect(() => {
		const burger = document.querySelector('.burger');
		const nav = document.querySelector('.nav-links');
		const center = document.querySelector('.center');
		const navLinks = document.querySelectorAll('.nav-links li');

		const toggleNavBar = () => {
			sideBarActive.current = !sideBarActive.current;

			nav.classList.toggle('nav-active');
			navLinks.forEach((link, index) => {
				if (link.style.animation === '') {
					link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.4}s`;
				} else link.style.animation = '';
			});
			burger.classList.toggle('toggle');
			center.classList.toggle('body-overlay');
		};

		if (context.token) {
			burger.addEventListener('click', () => toggleNavBar());

			center.addEventListener('click', () => {
				if (nav.classList.value === 'nav-links nav-active') toggleNavBar();
			});
		}

		const body = document.querySelector('body');
		const modeToggle = document.querySelector('.dark-light');

		if (darkMode) body.classList.add('dark');

		modeToggle.addEventListener('click', () => {
			body.classList.toggle('dark');
			if (!body.classList.contains('dark')) {
				localStorage.setItem('mode', 'light-mode');
			} else {
				localStorage.setItem('mode', 'dark-mode');
			}
		});

		return () => {
			if (context.token) {
				burger.removeEventListener('click', () => {
					nav.classList.toggle('nav-links');
				});
				center.removeEventListener('click', () => {
					if (nav.classList.value === 'nav-links nav-active') toggleNavBar();
				});
				modeToggle.removeEventListener('click', () => {});
			}
		};
	}, [context.token]);

	const modeButton = () => (
		<>
			<div className="dark-light" onClick={() => setDarkMode(!darkMode)}>
				{darkMode ? (
					<FiSun className="dark-light-icon" size={25} />
				) : (
					<FiMoon className="dark-light-icon" size={25} />
				)}
			</div>
		</>
	);

	return (
		<IconContext.Provider
			value={{
				style: { marginRight: '12px', marginBottom: '3px' },
			}}
		>
			<nav className="nav-color">
				<div className="logo">
					<h4>Guardias 911</h4>
				</div>
				{context.token ? (
					<>
						<ul className="nav-links">
							<li>
								<a href="#">
									<FaRegCalendarAlt />
									Cronograma
								</a>
							</li>
							<li>
								<a href="#">
									<FaList />
									Cambios
								</a>
							</li>
							<li>
								<a href="#">
									<FaExchangeAlt />
									Nuevo cambio
								</a>
							</li>
						</ul>
						{modeButton()}
						<FaUserAlt className="user-icon" size={20} />
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

{
	/* <Modal
		id="exampleModal"
		titulo="Cerrar sesión"
		cuerpo="¿Confirma que desea cerrar sesión?"
		funcion={logout}
	/> */
}
export default NavBar;
