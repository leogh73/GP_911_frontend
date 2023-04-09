import { createContext } from 'react';

const UserContext = createContext({
	token: null,
	setToken: () => {},
	userData: {},
	login: () => {},
	logout: () => {},
	state: {},
	dispatch: () => {},
});

export default UserContext;
