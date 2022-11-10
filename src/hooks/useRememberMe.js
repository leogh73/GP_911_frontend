const useRememberMe = () => {
	const loadUser = () => {
		const storedUser = JSON.parse(localStorage.getItem('storedUser'));
		return storedUser ? storedUser.usernameOrEmail : null;
	};

	const rememberUser = (usernameOrEmail, rememberMe) => {
		const storedUser = loadUser();
		if (storedUser && !rememberMe) localStorage.removeItem('storedUser');
		if (!storedUser && rememberMe)
			localStorage.setItem('storedUser', JSON.stringify({ usernameOrEmail: usernameOrEmail }));
	};

	return { loadUser, rememberUser };
};

export default useRememberMe;
