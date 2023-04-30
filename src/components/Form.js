import InputField from './InputField';
import Button from './Button';
import Title from './Title';

import useForm from '../hooks/useForm';

import './Form.css';

import Modal from './Modal';

const Form = ({ sendUserForm, pageName, formData }) => {
	const { state, submitForm, dispatch } = useForm(sendUserForm, pageName, formData.profile);

	const changeHandler = (e) => {
		dispatch({
			type: 'change',
			payload: {
				inputName: e.target.name ?? e.target.getAttribute('name'),
				value: e.target.value ?? e.target.getAttribute('value'),
			},
		});
	};

	const showModal = (errorType) => {
		const generateModal = (texts, type) => (
			<Modal
				id={'login-error'}
				texts={texts}
				functions={{
					close: () => dispatch({ type: 'error', payload: { status: false, type: null } }),
				}}
				type={type}
			/>
		);
		if (errorType === 'login')
			return generateModal(
				{ title: 'Error', body: 'Usuario y/o contraseña incorrectos.', close: 'Cerrar' },
				'error',
			);
		if (errorType === 'register')
			return generateModal(
				{
					title: 'Error',
					body: 'El usuario ya estaría registrado. Verifique los datos ingresados.',
					close: 'Cerrar',
				},
				'error',
			);
		if (errorType === 'server')
			return generateModal(
				{ title: 'Error', body: 'Error de conexión al servidor.', close: 'Cerrar' },
				'error',
			);
		if (errorType === 'password')
			return generateModal(
				{ title: 'Error', body: 'La contraseña actual es inválida', close: 'Cerrar' },
				'error',
			);
		if (errorType === 'user email')
			return generateModal(
				{
					title: 'Error',
					body: 'El correo electrónico ingresado no corresponde a ningún usuario registrado.',
					close: 'Cerrar',
				},
				'error',
			);
	};

	return (
		<div className="new-form">
			<div className={`form ${pageName}`}>
				<Title text={formData.title} icon={formData.icon} />
				<form action="" method="" name="register" onSubmit={submitForm}>
					<div className={`inputs-container ${pageName}`}>
						<div className="inputs-group">
							{state.inputs.map(
								(f, i) =>
									i < 5 && <InputField key={f.key} inputData={f} onChange={changeHandler} />,
							)}
						</div>
						{state.inputs.length > 4 && (
							<div className="inputs-group">
								{state.inputs.map(
									(f, i) =>
										i >= 5 && <InputField key={f.key} inputData={f} onChange={changeHandler} />,
								)}
							</div>
						)}
					</div>
					{formData.rememberMe}
					<div style={{ padding: '7px' }}>
						<Button
							className="button"
							text={formData.buttonText}
							width={220}
							disabled={!state.formIsValid}
							loading={state.loading}
						/>
					</div>
					{formData.footer}
				</form>
			</div>
			{state.error.status && showModal(state.error.type)}
		</div>
	);
};

export default Form;
