import { createContext } from 'react';

const UserContext = createContext({
	userData: {},
	isLoggedIn: null,
	login: () => {},
	logout: () => {},
	state: {},
	dispatch: () => {},
});

export default UserContext;
