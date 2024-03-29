import { useCallback, useRef, useEffect } from 'react';

const useHttpConnection = () => {
	const activeHttpConnections = useRef([]);

	const httpRequestHandler = useCallback(
		async (endpoint, method = 'GET', body = null, headers = {}) => {
			try {
				const abortConnection = new AbortController();
				activeHttpConnections.current.push(abortConnection);

				const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${endpoint}`, {
					method,
					body,
					headers,
					signal: abortConnection.signal,
					credentials: 'include',
					mode: 'cors',
				});

				const responseData = await response.json();

				activeHttpConnections.current = activeHttpConnections.current.filter(
					(reqCtrl) => reqCtrl !== abortConnection,
				);

				return responseData;
			} catch (error) {
				console.log(error);
				return { error: 'server' };
			}
		},
		[],
	);

	useEffect(() => {
		return () => {
			activeHttpConnections.current.forEach((abortControl) => abortControl.abort());
		};
	}, []);

	return { httpRequestHandler };
};

export default useHttpConnection;
