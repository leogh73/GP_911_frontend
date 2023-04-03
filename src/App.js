import { ToastContainer } from 'react-toastify';
import { IconContext } from 'react-icons';
import './App.css';

import NavBar from './components/NavBar';

import useUser from './hooks/useUser';
import useRoutes from './hooks/useRoutes';

import UserContext from './context/UserContext';

const App = () => {
	const { userData, token, login, logout } = useUser();
	const { routes, state, dispatch } = useRoutes(token, userData);

	return (
		<UserContext.Provider
			value={{
				userData,
				token,
				login,
				logout,
				state,
				dispatch,
			}}
		>
			<NavBar />
			<IconContext.Provider value={{ style: { color: 'slategray', backgroundColor: 'none' } }}>
				<div className="layout">{routes}</div>
			</IconContext.Provider>
			<ToastContainer />
			{/* <IdleTimer token={token} /> */}
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
