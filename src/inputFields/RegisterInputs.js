import { FaUsers, FaUser, FaIdCard, FaBuilding, FaEnvelope, FaKey } from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';
import { TbHierarchy } from 'react-icons/tb';

const inputs = [
	{
		key: 0,
		name: 'name',
		password: false,
		optionsList: [],
		icon: <HiUserCircle size={27} />,
		errorMessage: '',
		value: '',
		placeHolder: 'Nombre de usuario',
	},
	{
		key: 1,
		name: 'lastName',
		password: false,
		optionsList: [],
		icon: <FaUser />,
		errorMessage: '',
		value: '',
		placeHolder: 'Apellido',
	},
	{
		key: 2,
		name: 'firstName',
		optionsList: [],
		password: false,
		errorMessage: '',
		icon: <FaUser />,
		value: '',
		placeHolder: 'Nombre',
	},
	{
		key: 3,
		name: 'ni',
		optionsList: [],
		password: false,
		icon: <FaIdCard />,
		errorMessage: '',
		value: '',
		placeHolder: 'NI',
	},
	{
		key: 4,
		name: 'hierarchy',
		optionsList: [],
		password: false,
		icon: <TbHierarchy size={21} />,
		errorMessage: '',
		value: '',
		placeHolder: 'Jerarquía',
	},

	{
		key: 6,
		name: 'guard',
		optionsList: [],
		password: false,
		icon: <FaUsers />,
		errorMessage: '',
		value: '',
		placeHolder: 'Guardia',
	},
	{
		key: 7,
		name: 'email',
		optionsList: [],
		password: false,
		icon: <FaEnvelope />,
		errorMessage: '',
		value: '',
		placeHolder: 'Correo electrónico',
	},
	{
		key: 8,
		name: 'password',
		optionsList: [],
		password: true,
		icon: <FaKey />,
		errorMessage: '',
		value: '',
		placeHolder: 'Contraseña',
	},
	{
		key: 9,
		name: 'repeatPassword',
		optionsList: [],
		password: true,
		icon: <FaKey />,
		errorMessage: '',
		value: '',
		placeHolder: 'Repetir contraseña',
	},
];

const registerInputs = (admin) => {
	if (admin && inputs[4].name !== 'section') {
		inputs.splice(4, 0, {
			key: 5,
			name: 'section',
			optionsList: ['Teléfonía', 'Monitoreo', 'Despacho'],
			password: false,
			icon: <FaBuilding />,
			errorMessage: '',
			value: '',
			placeHolder: 'Sección',
		});
	}
	return inputs;
};
export default registerInputs;
