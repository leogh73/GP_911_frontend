const useRememberMe = () => {
	const loadUser = () => {
		const storedUser = JSON.parse(localStorage.getItem('storedUser'));
		return storedUser ? storedUser.usernameOrEmail : null;
	};

	const storeUser = (value) =>
		localStorage.setItem('storedUser', JSON.stringify({ usernameOrEmail: value }));

	const rememberUser = (usernameOrEmail, rememberMe) => {
		const storedUser = loadUser();
		if (storedUser && storedUser !== usernameOrEmail) storeUser(usernameOrEmail);
		if (storedUser && !rememberMe) localStorage.removeItem('storedUser');
		if (!storedUser && rememberMe) storeUser(usernameOrEmail);
	};

	return { loadUser, rememberUser };
};

export default useRememberMe;
