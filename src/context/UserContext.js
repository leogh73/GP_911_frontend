import { createContext } from 'react';

const UserContext = createContext({
	userData: {},
	token: null,
	login: () => {},
	logout: () => {},
	showRequestTab: null,
	toggleActiveTab: () => {},
	loadChangeData: () => {},
	activateEditionRoute: () => {},
});

export default UserContext;
