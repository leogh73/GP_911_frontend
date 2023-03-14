import { useCallback, useRef, useEffect } from 'react';

const useHttpConnection = () => {
	const activeHttpConnections = useRef([]);

	const httpRequestHandler = useCallback(
		async (url, method = 'GET', body = null, headers = {}) => {
			try {
				const abortConnection = new AbortController();
				activeHttpConnections.current.push(abortConnection);

				const response = await fetch(url, {
					method,
					body,
					headers,
					signal: abortConnection.signal,
				});

				const responseData = await response.json();

				activeHttpConnections.current = activeHttpConnections.current.filter(
					(reqCtrl) => reqCtrl !== abortConnection,
				);

				return responseData;
			} catch (error) {
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
