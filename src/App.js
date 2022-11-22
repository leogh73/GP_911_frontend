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
	const { token, firstName, lastName, guardId, superior, login, logout } = useUser();
	const { routes } = useRoutes(token, superior);

	return (
		<UserContext.Provider
			value={{
				token,
				firstName,
				lastName,
				guardId,
				superior,
				login,
				logout,
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
