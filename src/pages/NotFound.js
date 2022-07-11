import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import Message from '../components/Message';

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<Message
			title="Página inexistente"
			icon={<FaExclamationTriangle />}
			body="La página que intenta acceder no existe."
			buttonText="VOLVER"
			onClick={() => navigate('/')}
		/>
	);
};

export default NotFound;
