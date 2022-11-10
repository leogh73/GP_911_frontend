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

	// const goBack = () => {
	// 	setError(false);
	// 	setRegister(false);
	// };

	return <ChangeLoad resultSendChange={resultNewChange} />;
	// error ? (
	// 	<Message
	// 		title="Cambio no enviado"
	// 		icon={<FaExclamationTriangle />}
	// 		body="No se pudo completar el proceso de carga de cambio. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
	// 		buttonText="VOLVER"
	// 		onClick={goBack}
	// 	/>
	// ) : register ? (
	// 	<Message
	// 		title="Cambio registrado"
	// 		icon={<FaCheck />}
	// 		body="El cambio se registró correctamente."
	// 		buttonText="VOLVER"
	// 		onClick={() => navigate('/')}
	// 	/>
	// ) : (

	// <Form
	// 	sendUserForm={resultNewChange}
	// 	formTitle="Nuevo cambio"
	// 	inputTitle={true}
	// 	icon={<FaExchangeAlt />}
	// 	rememberMe=""
	// 	buttonText="ENVIAR CAMBIO"
	// 	pageName="new"
	// footer={
	// 	<div className="form-footer">
	// 		<hr className="my-4" />
	// 		<p className="text-center">
	// 			¿Ya es usuario? <Link to="/iniciarsesion">Iniciar sesión</Link>
	// 		</p>
	// 	</div>
	// }
	// />
	// );
};

export default ChangeNew;
