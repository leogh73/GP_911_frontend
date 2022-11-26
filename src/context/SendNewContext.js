import { createContext } from 'react';

const SendNewContext = createContext({
	openedMenu: null,
	loadOpenedMenu: () => {},
});

export default SendNewContext;
