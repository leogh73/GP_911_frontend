import { createContext } from 'react';

const UserContext = createContext({
	userData: {},
	token: null,
	login: () => {},
	logout: () => {},
	activeTab: null,
	loadActiveTab: () => {},
	loadChangeData: () => {},
	loadProfileData: () => {},
	activateEditionRoute: () => {},
});

export default UserContext;
