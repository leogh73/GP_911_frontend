import { useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FaExclamationTriangle } from 'react-icons/fa';
import Message from '../components/Message';

const ChangeError = ({ action }) => {
	const navigate = useNavigate();
	return (
		<IconContext.Provider
			value={{
				style: { color: 'slategray', minWidth: '50px', minHeight: '50px', marginBottom: '5px' },
			}}
		>
			<Message
				title={`Cambio no ${action.replace(/.$/, 'do')}`}
				icon={<FaExclamationTriangle />}
				body={`No se pudo ${action} el cambio. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas.`}
				buttonText="VOLVER"
				onClick={() => navigate('/')}
			/>
		</IconContext.Provider>
	);
};

export default ChangeError;
