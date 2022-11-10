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
}) => {
	const { inputs, changeHandler, validateForm, formIsValid, loginError, setLoginError, loading } =
		useForm(pageName, sendUserForm);

	// const spinnerBackground =
	// 	localStorage.getItem('mode') === 'light-mode'
	// 		? 'rgba(255, 255, 255, 0.4)'
	// 		: 'rgba(204, 205, 206, 0.4)';

	return (
		<div className="content">
			<div className="form">
				{/* <LoadingOverlay
					active={loading}
					styles={{
						overlay: (base) => ({
							...base,
							background: spinnerBackground,
						}),
					}}
					spinner={<Loading />}
				> */}
				<Title text={formTitle} icon={icon} />
				<form action="" method="" name="register" onSubmit={validateForm}>
					<div className="inputs-group">
						{inputs.map((f) => (
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
							/>
						))}
					</div>
					{rememberMe}
					<div style={{ padding: '7px' }}>
						<Button
							className="button"
							text={buttonText}
							width={220}
							disabled={!formIsValid}
							loading={loading}
						/>
					</div>
					{footer}
				</form>
				{/* </LoadingOverlay> */}
			</div>
			{loginError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'Usuario y/o contraseña incorrectos.'}
					closeText={'Cerrar'}
					closeFunction={() => setLoginError(false)}
					loginError={loginError}
				/>
			)}
		</div>
	);
};

export default Form;
