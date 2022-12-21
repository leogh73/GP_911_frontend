import { createContext } from 'react';

const UserContext = createContext({
	token: null,
	firstName: null,
	lastName: null,
	guardId: null,
	superior: null,
	login: () => {},
	logout: () => {},
	loadChangeData: () => {},
	activateEditionRoute: () => {},
});

export default UserContext;
