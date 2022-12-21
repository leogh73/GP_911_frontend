import { createContext } from 'react';

const SendNewContext = createContext({
	openedMenu: null,
	loadOpenedMenu: () => {},
	coverName: null,
	returnName: null,
	loadUserName: () => {},
});

export default SendNewContext;
