import { useContext } from 'react';
import { FaUsers, FaUser, FaIdCard, FaBuilding, FaEnvelope, FaKey } from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';
import { MdSupervisorAccount } from 'react-icons/md';
import { TbHierarchy } from 'react-icons/tb';
import UserContext from '../context/UserContext';

let inputs = [
	{
		key: 0,
		name: 'username',
		password: false,
		optionsList: [],
		icon: <HiUserCircle size={27} />,
		placeHolder: 'Nombre de usuario',
	},
	{
		key: 1,
		name: 'lastName',
		password: false,
		optionsList: [],
		icon: <FaUser />,
		placeHolder: 'Apellido',
	},
	{
		key: 2,
		name: 'firstName',
		optionsList: [],
		password: false,
		errorMessage: '',
		icon: <FaUser />,
		placeHolder: 'Nombre',
	},
	{
		key: 3,
		name: 'ni',
		optionsList: [],
		password: false,
		icon: <FaIdCard />,
		placeHolder: 'NI',
	},
	{
		key: 4,
		name: 'hierarchy',
		optionsList: [],
		password: false,
		icon: <TbHierarchy size={21} />,
		placeHolder: 'Jerarquía',
	},
	{
		key: 5,
		name: 'section',
		optionsList: ['Teléfonía', 'Monitoreo', 'Despacho'],
		password: false,
		icon: <FaBuilding />,
		placeHolder: 'Sección',
	},
	{
		key: 6,
		name: 'guardId',
		optionsList: [],
		password: false,
		icon: <FaUsers />,
		placeHolder: 'Guardia',
	},
	{
		key: 7,
		name: 'Superior',
		optionsList: ['Si', 'No'],
		password: false,
		icon: <MdSupervisorAccount size={28} />,
		placeHolder: 'Superior',
	},
	{
		key: 8,
		name: 'email',
		optionsList: [],
		password: false,
		icon: <FaEnvelope />,
		placeHolder: 'Correo electrónico',
	},
	{
		key: 9,
		name: 'password',
		optionsList: [],
		password: true,
		icon: <FaKey />,
		placeHolder: 'Contraseña',
	},
	{
		key: 10,
		name: 'repeatPassword',
		optionsList: [],
		password: true,
		icon: <FaKey />,
		placeHolder: 'Repetir contraseña',
	},
];

const registerInputs = (admin, superior, profile) => {
	inputs.forEach((input) => {
		input.disabled = !!profile ? true : false;
		input.errorMessage = '';
		input.value = '';
	});

	inputs[0].value = profile.data.username;
	inputs[1].value = profile.data.lastName;
	inputs[2].value = profile.data.firstName;
	inputs[3].value = profile.data.ni;
	inputs[4].value = profile.data.hierarchy;
	inputs[5].value = profile.data.section;
	inputs[6].value = profile.data.guardId;
	inputs[7].value = profile.data.superior;
	inputs[8].value = profile.data.email;

	if (!!profile) {
		inputs.splice(9, 2);
		if ((superior && profile.own) || (!superior && profile.own)) {
			inputs[0].disabled = false;
			inputs[7].disabled = false;
			inputs[8].disabled = false;
		}
		if (superior && !profile.own) {
			inputs[5].disabled = false;
			inputs[6].disabled = false;
		}
		console.log(inputs);
	}

	console.log(inputs);

	return inputs;
};

export default registerInputs;
