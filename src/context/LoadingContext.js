import { createContext } from 'react';

const LoadingContext = createContext({
	status: false,
	toggleLoading: () => {},
});

export default LoadingContext;
