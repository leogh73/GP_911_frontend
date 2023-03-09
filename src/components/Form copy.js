import InputField from './InputField';
import Button from './Button';
import Title from './Title';

import useForm from '../hooks/useForm';
import './Form.css';
import Modal from './Modal';
import UserContext from '../context/UserContext';
import { useContext, useEffect } from 'react';

const Form = ({
	sendUserForm,
	formTitle,
	inputTitle,
	icon,
	rememberMe,
	pageName,
	buttonText,
	footer,
	profileData,
	profileView,
}) => {
	const {
		inputs,
		changeHandler,
		validateForm,
		formIsValid,
		loading,
		loginError,
		setLoginError,
		serverError,
		setServerError,
	} = useForm(pageName, sendUserForm, profileData);

	const userContext = useContext(UserContext);
	const formIndex = pageName === 'register' ? 6 : 5;

	console.log(inputs);

	return (
		<div className="new-form">
			<div className={`form ${pageName}`}>
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
					<div className={`inputs-container ${pageName}`}>
						<div className="inputs-group">
							{inputs.map(
								(f, i) =>
									i < formIndex && (
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
						{inputs.length > 4 && (
							<div className="inputs-group">
								{inputs.map(
									(f, i) =>
										i >= formIndex && (
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
							disabled={!formIsValid}
							loading={loading}
						/>
					</div>
					{footer}
				</form>
				{/* </LoadingOverlay> */}
			</div>
			{/* {loading && <Loading type={'closed'} />} */}
			{loginError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'Usuario y/o contraseña incorrectos.'}
					closeText={'Cerrar'}
					closeFunction={() => setLoginError(false)}
					error={loginError}
				/>
			)}
			{serverError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'Error de conexión al servidor.'}
					closeText={'Cerrar'}
					closeFunction={() => setServerError(false)}
					error={serverError}
				/>
			)}
		</div>
	);
};

export default Form;
