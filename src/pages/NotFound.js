import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import Message from '../components/Message';

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div
			style={{
				maxWidth: '850px',
				animation: 'bgFadeIn 0.6s ease',
				height: 'fit-content',
				padding: '1em',
				boxShadow: '0 5px 10px rgb(0 0 0 / 20%)',
				backgroundColor: 'var(--text-color)',
				border: '1px solid rgba(0, 0, 0, 0.15)',
				borderRadius: '1rem',
			}}
		>
			<Message
				title="Página inexistente"
				icon={<FaExclamationTriangle />}
				body="La página que intenta acceder no existe."
				buttonText="VOLVER"
				onClick={() => navigate('/')}
			/>
		</div>
	);
};

export default NotFound;
