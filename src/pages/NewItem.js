import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import ChangeLoad from '../components/ChangeLoad';
import RequestLoad from '../components/RequestLoad';
import AffectedLoad from '../components/AffectedLoad';

const NewItem = ({ type }) => {
	const navigate = useNavigate();

	const toastMessage = (toast) => {
		if (toast === 'success') {
			switch (type) {
				case 'change':
					return 'Cambio registrado correctamente.';
				case 'request':
					return 'Pedido registrado correctamente.';
				case 'affected':
					return 'Personal afectado registrado correctamente.';
				default:
					break;
			}
		}
		if (toast === 'error') {
			switch (type) {
				case 'change':
					return 'No se pudo completar el proceso de carga de cambio.';
				case 'request':
					return 'No se pudo completar el proceso de carga de pedido.';
				case 'affected':
					return 'No se pudo completar el proceso de carga.';
				default:
					break;
			}
		}
	};

	const resultNewChange = (result) => {
		if (type === 'change') navigate('/changes/agreed');
		if (type === 'request') navigate('/changes/requested');
		if (type === 'affected') navigate('/affected');
		if (result && result._id) toast(toastMessage('success'), { type: 'success' });
		if (!result || result.error) toast(toastMessage('error'), { type: 'error' });
	};

	const loadForm = (type) => {
		switch (type) {
			case 'change':
				return <ChangeLoad sendResult={resultNewChange} />;
			case 'request':
				return <RequestLoad sendResult={resultNewChange} />;
			case 'affected':
				return <AffectedLoad sendResult={resultNewChange} />;
			default:
				break;
		}
	};

	return <>{loadForm(type)}</>;
};

export default NewItem;
