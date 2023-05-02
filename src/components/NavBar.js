import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { IconContext } from 'react-icons';
import {
	FaRegCalendarAlt,
	FaList,
	FaUserClock,
	FaUserAlt,
	FaUserCircle,
	FaKey,
	FaSignOutAlt,
	FaUsers,
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { FiSun, FiMoon } from 'react-icons/fi';
import UserContext from '../context/UserContext';
import './NavBar.css';

const NavBar = ({ navBarState }) => {
	const userContext = useContext(UserContext);
	const navigate = useNavigate();
	const location = useLocation();

	const logout = () => {
		userContext.logout(false);
		navigate('/');
	};

	const getActiveLink = (path) => {
		switch (path) {
			case '/':
				return '/changes';
			case '/changes/agreed':
				return '/changes';
			case '/changes/requested':
				return '/changes';
			case '/schedule/month':
				return '/schedule';
			case '/schedule/search':
				return '/schedule';
			case '/changes/edit':
				return '/changes';
			case '/newrequest':
				return '/changes';
			case '/newchange':
				return '/changes';
			case '/affected':
				return '/affected';
			case '/newaffected':
				return '/affected';
			case '/users':
				return '/users';
			case '/users/phoning':
				return '/users';
			case '/users/dispatch':
				return '/users';
			case '/users/monitoring':
				return '/users';
			default:
				return path;
		}
	};

	useEffect(() => {
		const burger = document.querySelector('.burger');
		const navLinks = document.querySelector('.nav-links');
		const layout = document.querySelector('.layout');
		const userMenu = navBarState.isLoggedIn ? document.querySelector('.user-toggle') : null;
		const navLinksList = document.querySelectorAll('.nav-links li');

		const body = document.querySelector('body');

		const toggleNavBar = () => {
			navLinks.classList.toggle('nav-active');
			navLinksList.forEach((link, index) => {
				if (link.style.animation === '') {
					link.style.animation = `navLinkFade 0.4s ease forwards ${index / 7 + 0.4}s`;
				} else link.style.animation = '';
				link.addEventListener('click', () => {
					if (navLinks.classList.contains('nav-active')) toggleNavBar();
				});
			});
			burger.classList.toggle('toggle');
			layout.classList.toggle('body-overlay');
			// body.classList.toggle('body-navbar-overflow');
		};

		if (navBarState.isLoggedIn) {
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
			window.onscroll = () => navLinks.classList.contains('nav-active') && toggleNavBar();
		}

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
			if (navBarState.isLoggedIn) {
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
				navLinksList.forEach((link) => {
					if (link.classList.contains('clicked')) link.classList.remove('clicked');
				});
			}
		};
	}, [navBarState.isLoggedIn]);

	useEffect(() => {
		if (navBarState.isLoggedIn) {
			const navLinksList = document.querySelectorAll('.nav-links li');
			navLinksList.forEach((link) => {
				if (link.classList.contains('clicked')) link.classList.remove('clicked');
			});
			let clickedUrl = getActiveLink(location.pathname);
			let activeLink = document.getElementById(clickedUrl);
			if (!!activeLink) activeLink.classList.add('clicked');
		}
	}, [navBarState.isLoggedIn, location.pathname]);

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

	const navLinksClickHandler = (e) => {
		const navLinksList = document.querySelectorAll('.nav-links li');
		let clickedUrl = getActiveLink(e.target.getAttribute('href'));
		if (!!clickedUrl) {
			navLinksList.forEach((link) => {
				if (link.classList.contains('clicked')) link.classList.remove('clicked');
			});
			let activeLink = document.getElementById(clickedUrl);
			activeLink.classList.add('clicked');
		}
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
				{navBarState.isLoggedIn ? (
					<>
						<ul className="nav-links" onClick={navLinksClickHandler}>
							<li id={'/schedule'}>
								<div className="link-container">
									<Link
										to={
											location.pathname.startsWith('/schedule') ? location.pathname : '/schedule'
										}
									>
										<FaRegCalendarAlt />
										CRONOGRAMA
									</Link>
								</div>
							</li>
							<li id={'/changes'}>
								<div className="link-container">
									<Link
										to={location.pathname.startsWith('/changes') ? location.pathname : '/changes'}
									>
										<FaList />
										CAMBIOS
									</Link>
								</div>
							</li>
							<li id={'/affected'}>
								<div className="link-container">
									<Link to="/affected">
										<FaUserClock />
										AFECTADOS/DESAFECTADOS
									</Link>
								</div>
							</li>
							{navBarState.isAdmin && (
								<li id={'/users'}>
									<div className="link-container">
										<Link
											to={location.pathname.startsWith('/users') ? location.pathname : '/users'}
										>
											<FaUsers />
											USUARIOS
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
								<Link className="user-link" to="/profile">
									<h3 className="user-header">
										<FaUserCircle size={32} />
										<div className="user-name">{`${userContext.userData?.firstName} ${userContext.userData?.lastName}`}</div>
									</h3>
								</Link>
								<div className="usermenu-separator"></div>
								<Link className="user-link" to="/changepassword">
									<FaKey />
									Cambiar contraseña
								</Link>
								<Link className="user-link" to="/" onClick={logout}>
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
