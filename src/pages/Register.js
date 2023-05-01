import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import { FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import { useContext } from 'react';

const Register = ({ section }) => {
	const userContext = useContext(UserContext);
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
			pageName="register"
			formData={{
				title: 'Registro de usuario',
				icon: <FaUserPlus />,
				rememberMe: '',
				buttonText: 'REGISTRAR',
				profile: { section: section, userId: userContext.userData._id, view: false },
			}}
		/>
	);
};

export default Register;
