import { createContext } from 'react';

const UserContext = createContext({
	userData: {},
	token: null,
	login: () => {},
	logout: () => {},
	activeTab: null,
	loadActiveTab: () => {},
	loadChangeData: () => {},
	activateEditionRoute: () => {},
});

export default UserContext;
