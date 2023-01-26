import { createContext } from 'react';

const SendNewContext = createContext({
	openedMenu: null,
	loadOpenedMenu: () => {},
	coverUser: null,
	returnUser: null,
});

export default SendNewContext;
