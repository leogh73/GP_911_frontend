import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { IconContext } from 'react-icons';
import './App.css';

import NavBar from './components/NavBar';

import useUser from './hooks/useUser';
import useRoutes from './hooks/useRoutes';

import UserContext from './context/UserContext';
import Loading from './components/Loading';
import IdleTimer from './components/IdleTimer';
// import IdleTimer from './components/IdleTimer';

const App = () => {
	const [navBarState, setNavBarState] = useState({ isLoggedIn: false, isAdmin: false });
	const { token, userData, login, logout, loading } = useUser(setNavBarState);
	const { routes, state, dispatch } = useRoutes(userData);

	return (
		<UserContext.Provider
			value={{
				token,
				userData,
				login,
				logout,
				state,
				dispatch,
			}}
		>
			<NavBar navBarState={navBarState} />
			<IconContext.Provider value={{ style: { color: 'slategray', backgroundColor: 'none' } }}>
				{loading ? (
					<div className="spinner-container-main">
						<Loading type={'closed'} />
					</div>
				) : (
					<div className="layout">{routes}</div>
				)}
			</IconContext.Provider>
			<ToastContainer />
			<IdleTimer isLoggedIn={navBarState.isLoggedIn} />
			<footer className="footer">
				<div className="ft-logo">
					<img alt="" src={'https://guardias911.pages.dev/911-logo.png'}></img>
				</div>
				<div className="ft-text">© 2023</div>
			</footer>
		</UserContext.Provider>
	);
};

export default App;
