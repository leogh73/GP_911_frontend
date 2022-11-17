import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import RequestLoad from '../components/RequestLoad';

const RequestNew = () => {
	const navigate = useNavigate();

	const resultNewRequest = (result) => {
		if (result && result._id) toast('Pedido registrado correctamente.', { type: 'success' });
		if (!result || result.error)
			toast('No se pudo completar enviar su pedido.', { type: 'error' });
		navigate('/');
	};

	return <RequestLoad sendResult={resultNewRequest} />;
};

export default RequestNew;
