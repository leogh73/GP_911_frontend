import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import ChangeLoad from '../components/ChangeLoad';

const ChangeNew = () => {
	const navigate = useNavigate();

	const resultNewChange = (result) => {
		if (result && result._id) toast('Cambio registrado correctamente.', { type: 'success' });
		if (!result || result.error)
			toast('No se pudo completar el proceso de carga de cambio.', { type: 'error' });
		navigate('/');
	};

	return <ChangeLoad sendResult={resultNewChange} />;
};

export default ChangeNew;
