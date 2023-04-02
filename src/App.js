import { ToastContainer } from 'react-toastify';
import { IconContext } from 'react-icons';
import './App.css';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import IdleTimer from './components/IdleTimer';

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
			<Footer />
		</UserContext.Provider>
	);
};

export default App;
