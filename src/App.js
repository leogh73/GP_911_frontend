import { ToastContainer } from 'react-toastify';
import { IconContext } from 'react-icons';
import './App.css';

import NavBar from './components/NavBar';

import useUser from './hooks/useUser';
import useRoutes from './hooks/useRoutes';

import UserContext from './context/UserContext';
import Loading from './components/Loading';

const App = () => {
	const { token, userData, login, logout, loading } = useUser();
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
