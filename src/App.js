import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { IconContext } from 'react-icons';
import './App.css';

import NavBar from './components/NavBar';

import useUser from './hooks/useUser';
import useRoutes from './hooks/useRoutes';

import UserContext from './context/UserContext';
import Loading from './components/Loading';

const App = () => {
	const [navBar, setNavBar] = useState(<NavBar token={null} key={'01'} />);
	const { token, userData, login, logout, loading } = useUser(setNavBar);
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
			{navBar}
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
			{/* <IdleTimer isLoggedIn={isLoggedIn} /> */}
			<footer className="footer">
				<div className="ft-logo">
					<img alt="" src={'./logo-911.png'}></img>
				</div>
				<div className="ft-text">© 2022</div>
			</footer>
		</UserContext.Provider>
	);
};

export default App;
