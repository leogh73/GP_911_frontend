import { FaKey, FaEnvelope } from 'react-icons/fa';

const passwordInputs = (type) => {
	return type === 'change'
		? [
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
		  ]
		: [
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
};

export default passwordInputs;
