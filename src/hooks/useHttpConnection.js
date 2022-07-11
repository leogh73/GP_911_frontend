import { useState, useCallback, useRef, useEffect } from 'react';

const useHttpConnection = () => {
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);
	const activeHttpConnections = useRef([]);

	const httpRequestHandler = useCallback(
		async (url, method = 'GET', body = null, headers = {}) => {
			setLoading(true);
			const abortConnection = new AbortController();
			activeHttpConnections.current.push(abortConnection);

			try {
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

				if (responseData.error) {
					setError(true);
					return;
				}

				setLoading(false);
				return responseData;
			} catch (err) {
				setError(true);
				setLoading(false);
			}
		},
		[],
	);

	const cleanError = () => {
		setError(null);
	};

	useEffect(() => {
		return () => {
			activeHttpConnections.current.forEach((abortControl) => abortControl.abort());
		};
	}, []);

	return { loading, error, httpRequestHandler, cleanError };
};

export default useHttpConnection;
