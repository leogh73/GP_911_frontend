import { FaKey, FaEnvelope } from 'react-icons/fa';

const passwordInputs = (type) => {
	let inputs;
	if (type === 'change')
		inputs = [
			{
				key: 1,
				name: 'currentPassword',
				optionsList: [],
				password: true,
				icon: <FaKey />,
				errorMessage: '',
				value: '',
				placeHolder: 'Contraseña actual',
			},
			{
				key: 2,
				name: 'newPassword',
				optionsList: [],
				password: true,
				icon: <FaKey />,
				errorMessage: '',
				value: '',
				placeHolder: 'Nueva contraseña',
			},
			{
				key: 3,
				name: 'repeatNewPassword',
				optionsList: [],
				password: true,
				icon: <FaKey />,
				errorMessage: '',
				value: '',
				placeHolder: 'Repetir nueva contraseña',
			},
		];
	if (type === 'forgot')
		inputs = [
			{
				key: 1,
				name: 'email',
				optionsList: [],
				password: false,
				icon: <FaEnvelope />,
				errorMessage: '',
				value: '',
				placeHolder: 'Correo electrónico',
			},
		];
	if (type === 'new')
		inputs = [
			{
				key: 0,
				name: 'newPassword',
				optionsList: [],
				password: true,
				icon: <FaKey />,
				errorMessage: '',
				value: '',
				placeHolder: 'Nueva contraseña',
			},
			{
				key: 1,
				name: 'repeatNewPassword',
				optionsList: [],
				password: true,
				icon: <FaKey />,
				errorMessage: '',
				value: '',
				placeHolder: 'Repetir nueva contraseña',
			},
		];
	return inputs;
};

export default passwordInputs;
