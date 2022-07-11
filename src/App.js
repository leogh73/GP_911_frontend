import { ToastContainer } from 'react-toastify';
import './App.css';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import IdleTimer from './components/IdleTimer';

import UserContext from './context/UserContext';
import useUser from './hooks/useUser';
import useRoutes from './hooks/useRoutes';

const App = () => {
	const { token, fullName, guardId, superior, userGuards, login, logout } = useUser();
	const { routes, loadAction, activateActionRoute } = useRoutes(token, superior);

	return (
		<UserContext.Provider
			value={{
				token,
				fullName,
				guardId,
				superior,
				userGuards,
				loadAction,
				activateActionRoute,
				login,
				logout,
			}}
		>
			<NavBar />
			<div className="center">{routes}</div>
			<ToastContainer />
			<IdleTimer token={token} />

			<Footer />
		</UserContext.Provider>
	);
};

export default App;
