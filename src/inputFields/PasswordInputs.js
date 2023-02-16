import { FaKey, FaEnvelope } from 'react-icons/fa';

const passwordInputs = (type) => {
	return type === 'change'
		? [
				{
					key: 7,
					name: 'oldPassword',
					optionsList: [],
					password: true,
					icon: <FaKey />,
					errorMessage: '',
					value: '',
					placeHolder: 'Contraseña actual',
				},
				{
					key: 7,
					name: 'newPassword',
					optionsList: [],
					password: true,
					icon: <FaKey />,
					errorMessage: '',
					value: '',
					placeHolder: 'Nueva contraseña',
				},
				{
					key: 8,
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
