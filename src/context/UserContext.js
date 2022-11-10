import { createContext } from 'react';

const UserContext = createContext({
	token: null,
	fullName: null,
	guardId: null,
	superior: null,
	userGuards: null,
	loadAction: () => {},
	activateActionRoute: () => {},
	login: () => {},
	logout: () => {},
});

export default UserContext;
