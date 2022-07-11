import React from 'react';
// import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChangeLoad from '../components/ChangeLoad';
// import Mensaje from '../componentes/Mensaje';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const ChangeNew = () => {
	// const [registro, setRegistro] = useState(false);
	// const [error, setError] = useState(false);

	const navigate = useNavigate();

	const resultNewChange = (result) => {
		console.log(result);
		if (result && result._id)
			// setRegistro(true);
			toast('Cambio registrado correctamente.', { type: 'success' });
		if (!result || result.error)
			toast('No se pudo completar el proceso de carga de cambio.', { type: 'error' });
		navigate('/');
	};

	// const volver = () => {
	// 	setError(false);
	// 	setRegistro(false);
	// };

	return <ChangeLoad resultSendChange={resultNewChange} />;

	// error ? (
	// 	<Mensaje
	// 		titulo="Cambio no enviado"
	// 		icono={<FaExclamationTriangle />}
	// 		cuerpo="No se pudo completar el proceso de carga de cambio. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
	// 		textoBoton="VOLVER"
	// 		onClick={volver}
	// 	/>
	// ) : registro ? (
	// 	<Mensaje
	// 		titulo="Cambio registrado"
	// 		icono={<FaCheck />}
	// 		cuerpo="El cambio se registró correctamente."
	// 		textoBoton="VOLVER"
	// 		onClick={() => navigate('/')}
	// 	/>
	// ) :	(

	// );
};

export default ChangeNew;
