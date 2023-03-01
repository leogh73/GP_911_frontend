import { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

const useHttpConnection = () => {
	const userContext = useContext(UserContext);
	const navigate = useNavigate();
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
				return { error };
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
