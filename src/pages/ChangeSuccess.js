import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FaCheck } from 'react-icons/fa';
import Message from '../components/Message';

const ChangeSuccess = ({ action }) => {
	const navigate = useNavigate();
	const [body, setBody] = useState();
	const [title, setTitle] = useState();

	useEffect(() => {
		const evaluateAction = () => {
			if (action === 'noaprobar') {
				setBody('El cambio no fue aprobado correctamente.');
				setTitle('Cambio no aprobado.');
			} else {
				setBody(`El cambio fue ${action.replace(/.$/, 'do')} correctamente.`);
				setTitle(`Cambio ${action.replace(/.$/, 'do')}`);
			}
		};
		evaluateAction();
	}, [action, setBody, setTitle]);

	return (
		<IconContext.Provider
			value={{
				style: { color: 'slategray', minWidth: '50px', minHeight: '50px', marginBottom: '5px' },
			}}
		>
			<Message
				title={title}
				icon={<FaCheck />}
				body={body}
				buttonText="VOLVER"
				onClick={() => navigate('/')}
			/>
		</IconContext.Provider>
	);
};

export default ChangeSuccess;
