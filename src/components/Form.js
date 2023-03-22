import InputField from './InputField';
import Button from './Button';
import Title from './Title';

import useForm from '../hooks/useForm';
import './Form.css';
import Modal from './Modal';
import UserContext from '../context/UserContext';
import { useContext, useEffect } from 'react';
import { BiCommentDetail } from 'react-icons/bi';

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
}) => {
	const { state, submitForm, dispatch } = useForm(pageName, sendUserForm, profileData, section);
	// const userContext = useContext(UserContext);
	const formIndex = 5;

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
		let dispatchType;
		if (type === 'login') dispatchType = 'login error';
		if (type === 'register') dispatchType = 'register error';
		if (type === 'server') dispatchType = 'server error';
		dispatch({
			type: dispatchType,
			payload: { status: false },
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
				{/* </LoadingOverlay> */}
			</div>
			{/* {loading && <Loading type={'closed'} />} */}

			{state.loginError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'Usuario y/o contraseña incorrectos.'}
					closeText={'Cerrar'}
					closeFunction={() => closeErrorModal('login')}
					error={state.loginError}
				/>
			)}
			{state.registerError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'El usuario ya estaría registrado. Verifique los datos ingresados.'}
					closeText={'Cerrar'}
					closeFunction={() => closeErrorModal('register')}
					error={state.registerError}
				/>
			)}
			{state.serverError && (
				<Modal
					id="login-error"
					title={'Error'}
					body={'Error de conexión al servidor.'}
					closeText={'Cerrar'}
					closeFunction={() => closeErrorModal('server')}
					error={state.serverError}
				/>
			)}
		</div>
	);
};

export default Form;
