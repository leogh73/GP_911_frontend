import { createContext } from 'react';

const UserContext = createContext({
	token: null,
	firstName: null,
	lastName: null,
	guardId: null,
	superior: null,
	userGuards: null,
	loadAction: () => {},
	activateActionRoute: () => {},
	login: () => {},
	logout: () => {},
});

export default UserContext;
