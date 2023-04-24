import InputField from './InputField';
import Button from './Button';
import Title from './Title';

import useForm from '../hooks/useForm';

import './Form.css';

import Modal from './Modal';

const Form = ({
	sendUserForm,
	formTitle,
	inputTitle,
	icon,
	rememberMe,
	pageName,
	buttonText,
	footer,
	section,
	profileData,
	profileView,
	userId,
}) => {
	const { state, submitForm, dispatch } = useForm(
		pageName,
		sendUserForm,
		profileData,
		section,
		userId,
	);

	const changeHandler = (e) => {
		dispatch({
			type: 'change',
			payload: {
				inputName: e.target.name ?? e.target.getAttribute('name'),
				value: e.target.value ?? e.target.getAttribute('value'),
			},
		});
	};

	const closeErrorModal = (type) => {
		dispatch({
			type,
			payload: { status: false },
		});
	};

	return (
		<div className="new-form">
			<div className={`form ${pageName}`}>
				<Title text={formTitle} icon={icon} />
				<form action="" method="" name="register" onSubmit={submitForm}>
					<div className={`inputs-container ${pageName}`}>
						<div className="inputs-group">
							{state.inputs.map(
								(f, i) =>
									i < 5 && (
										<InputField
											key={f.key}
											showTitle={inputTitle}
											name={f.name}
											optionsList={f.optionsList}
											password={f.password}
											icon={f.icon}
											errorMessage={f.errorMessage}
											value={f.value}
											onChange={changeHandler}
											placeHolder={f.placeHolder}
											disabled={f.disabled}
											profileView={profileView}
										/>
									),
							)}
						</div>
						{state.inputs.length > 4 && (
							<div className="inputs-group">
								{state.inputs.map(
									(f, i) =>
										i >= 5 && (
											<InputField
												key={f.key}
												showTitle={inputTitle}
												name={f.name}
												optionsList={f.optionsList}
												password={f.password}
												icon={f.icon}
												errorMessage={f.errorMessage}
												value={f.value}
												onChange={changeHandler}
												placeHolder={f.placeHolder}
												disabled={f.disabled}
												profileView={profileView}
											/>
										),
								)}
							</div>
						)}
					</div>
					{rememberMe}
					<div style={{ padding: '7px' }}>
						<Button
							className="button"
							text={buttonText}
							width={220}
							disabled={!state.formIsValid}
							loading={state.loading}
						/>
					</div>
					{footer}
				</form>
			</div>
			{state.loginError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'Usuario y/o contraseña incorrectos.'}
					closeText={'Cerrar'}
					closeFunction={() => closeErrorModal('login error')}
					type={'error'}
				/>
			)}
			{state.registerError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'El usuario ya estaría registrado. Verifique los datos ingresados.'}
					closeText={'Cerrar'}
					closeFunction={() => closeErrorModal('register error')}
					type={'error'}
				/>
			)}
			{state.serverError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'Error de conexión al servidor.'}
					closeText={'Cerrar'}
					closeFunction={() => closeErrorModal('server error')}
					type={'error'}
				/>
			)}
			{state.passwordError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'La contraseña actual es inválida.'}
					closeText={'Cerrar'}
					closeFunction={() => closeErrorModal('password error')}
					type={'error'}
				/>
			)}
			{state.userEmailError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'El correo electrónico ingresado no corresponde a ningún usuario registrado.'}
					closeText={'Cerrar'}
					closeFunction={() => closeErrorModal('user email error')}
					type={'error'}
				/>
			)}
		</div>
	);
};

export default Form;
