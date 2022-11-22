import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import AffectedLoad from '../components/AffectedLoad';

const AffectedNew = () => {
	const navigate = useNavigate();

	const resultNewRequest = (result) => {
		if (result && result._id) toast('Datos registrados correctamente.', { type: 'success' });
		if (!result || result.error) toast('No se pudieron enviar los datos.', { type: 'error' });
		navigate('/');
	};

	return <AffectedLoad sendResult={resultNewRequest} />;
};

export default AffectedNew;
