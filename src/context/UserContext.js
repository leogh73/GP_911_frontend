import { createContext } from 'react';

const UserContext = createContext({
	userData: {},
	token: null,
	login: () => {},
	logout: () => {},
	state: {},
	dispatch: () => {},
});

export default UserContext;
