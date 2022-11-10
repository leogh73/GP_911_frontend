import { FaUser, FaKey } from 'react-icons/fa';

const loginInputs = [
	{
		key: 0,
		name: 'usernameOrEmail',
		password: false,
		optionsList: [],
		icon: <FaUser />,
		errorMessage: '',
		value: '',
		placeHolder: 'Usuario o correo electrónico',
	},
	{
		key: 1,
		name: 'password',
		password: true,
		optionsList: [],
		icon: <FaKey />,
		errorMessage: '',
		value: '',
		placeHolder: 'Contraseña',
	},
];

export default loginInputs;
