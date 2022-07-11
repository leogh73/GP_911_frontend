import { useCallback } from 'react';

const useRememberMe = () => {
	const loadUser = useCallback(() => {
		const storedUser = JSON.parse(localStorage.getItem('storedUser'));
		if (storedUser) return storedUser.usernameOrEmail;
		if (!storedUser) return null;
	}, []);

	const rememberUser = useCallback(
		(usernameOrEmail, rememberMe) => {
			const storedUser = loadUser();
			if (storedUser && !rememberMe) localStorage.removeItem('storedUser');
			if (!storedUser && rememberMe)
				localStorage.setItem('storedUser', JSON.stringify({ usernameOrEmail: usernameOrEmail }));
		},
		[loadUser],
	);

	return { loadUser, rememberUser };
};

export default useRememberMe;
