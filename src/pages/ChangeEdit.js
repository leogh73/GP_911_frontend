import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import ChangeLoad from '../components/ChangeLoad';

const ChangeEdit = ({ changeData }) => {
	const navigate = useNavigate();

	const resultEditChange = (result) => {
		if (result && result._id) toast('Cambio modificado correctamente.', { type: 'success' });
		if (!result || result.error)
			toast('No se pudo completar la modificación del cambio.', { type: 'error' });
		navigate('/');
	};

	return <ChangeLoad sendResult={resultEditChange} startData={changeData} />;
};

export default ChangeEdit;
