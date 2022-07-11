import { useRef, useEffect } from 'react';
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

			console.log(sideBarActive.current);
			nav.classList.toggle('nav-active');
			navLinks.forEach((link, index) => {
				if (link.style.animation === '') {
					link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.4}s`;
				} else link.style.animation = '';
			});
			burger.classList.toggle('toggle');
			center.classList.toggle('body-overlay');
		};

		burger.addEventListener('click', () => toggleNavBar());

		center.addEventListener('click', () => {
			if (nav.classList.value === 'nav-links nav-active') toggleNavBar();
		});

		return () => {
			burger.removeEventListener('click', () => {
				nav.classList.toggle('nav-links');
			});
			center.removeEventListener('click', () => {
				if (nav.classList.value === 'nav-links nav-active') toggleNavBar();
			});
		};
	}, [sideBarActive]);

	return (
		<IconContext.Provider
			value={{
				style: { marginRight: '12px', marginBottom: '3px' },
			}}
		>
			<nav>
				<div className="logo">
					<h4>Guardias 911</h4>
				</div>
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
				<div className="icon">
					<FiSun />
				</div>
				<div className="icon">
					<FaUserAlt />
				</div>
				<div className="burger">
					<div className="line1"></div>
					<div className="line2"></div>
					<div className="line3"></div>
				</div>
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
