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
	const { formState, sendFormData, dispatch } = useForm(pageName, sendUserForm, profileData);

	// const userContext = useContext(UserContext);
	const formIndex = pageName === 'register' ? 6 : 5;

	const submitHandler = () => {};

	const changeHandler = (e) => {
		dispatch({ payload: { type: 'change', inputName: e.target.name, value: e.target.value } });
	};

	const closeErrorModal = (type) => {
		dispatch({
			payload: { type: type === 'login' ? 'login-error' : 'server-error', status: false },
		});
	};

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
				<form action="" method="" name="register" onSubmit={sendFormData}>
					<div className={`inputs-container ${pageName}`}>
						<div className="inputs-group">
							{formState.inputs.map(
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
						{formState.inputs.length > 4 && (
							<div className="formState.inputs-group">
								{formState.inputs.map(
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
							disabled={!formState.formIsValid}
							loading={formState.loading}
						/>
					</div>
					{footer}
				</form>
				{/* </LoadingOverlay> */}
			</div>
			{/* {loading && <Loading type={'closed'} />} */}
			{formState.loginError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'Usuario y/o contraseña incorrectos.'}
					closeText={'Cerrar'}
					closeFunction={() => closeErrorModal('login')}
					error={formState.loginError}
				/>
			)}
			{formState.serverError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'Error de conexión al servidor.'}
					closeText={'Cerrar'}
					closeFunction={() => closeErrorModal('server')}
					error={formState.serverError}
				/>
			)}
		</div>
	);
};

export default Form;
