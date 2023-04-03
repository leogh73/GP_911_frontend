import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Register = ({ section }) => {
	const navigate = useNavigate();

	const registerResult = (result) => {
		navigate(`/users/${section.toLowerCase()}`);
		result.result._id
			? toast('Personal registrado correctamente.', { type: 'success' })
			: toast('No se pudo completar el proceso de registro.', { type: 'error' });
	};

	return (
		<Form
			sendUserForm={registerResult}
			formTitle="Registro de usuario"
			icon={<FaUserPlus />}
			rememberMe=""
			buttonText="REGISTRAR"
			pageName="register"
			section={section}
		/>
	);
};

export default Register;
