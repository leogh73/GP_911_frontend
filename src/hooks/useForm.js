import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import loginInputs from '../inputFields/LoginInputs';
import passwordInputs from '../inputFields/PasswordInputs';
import passwordSchema from '../schemas/PasswordForm';
import loginSchema from '../schemas/LoginForm';
import registerInputs from '../inputFields/RegisterInputs';
import registerSchema from '../schemas/RegisterForm';
import useHttpConnection from './useHttpConnection';
import useRememberMe from './useRememberMe';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const useForm = (pageName, sendUserForm, profileData) => {
	const { loadUser } = useRememberMe();
	const { httpRequestHandler } = useHttpConnection();
	const userContext = useContext(UserContext);
	const storedUser = loadUser();
	const navigate = useNavigate();

	const formInputs = () => {
		let formInputs;
		if (pageName === 'register') formInputs = registerInputs;
		if (pageName === 'login') {
			formInputs = loginInputs;
			formInputs[0].value = storedUser ?? formInputs[0].value;
		}
		if (pageName === 'change-password') {
			formInputs = passwordInputs('change');
		}
		if (pageName === 'forgot-password') {
			formInputs = passwordInputs('forgot');
		}
		if (pageName === 'profile-edit') {
			// formInputs = requestedInputs(registerInputs);
		}
		return formInputs;
	};

	const [formState, dispatch] = useReducer(reducer, {
		inputs: formInputs(),
		formIsValid: false,
		loading: false,
		loginError: false,
		serverError: false,
	});

	// useEffect(() => {
	// 	return () => {
	// 		formState.inputs.forEach((i) => (i.value = ''));
	// 	};
	// }, []);

	const registeredData = (inputs) => {
		console.log(inputs);
		let registeredData = {};
		if (pageName === 'register')
			registeredData = {
				username: inputs[0].value,
				lastName: inputs[1].value,
				firstName: inputs[2].value,
				ni: inputs[3].value,
				hierarchy: inputs[4].value,
				section: inputs[5].value,
				guardId: inputs[6].value,
				superior: inputs[7].value,
				email: inputs[8].value,
				password: inputs[9].value,
				repeatPassword: inputs[10].value,
			};
		if (pageName === 'login') {
			registeredData = {
				usernameOrEmail: inputs[0].value,
				password: inputs[1].value,
			};
		}
		if (pageName === 'change-password') {
			registeredData = {
				currentPassword: inputs[0].value,
				newPassword: inputs[1].value,
				repeatNewPassword: inputs[2].value,
			};
		}
		if (pageName === 'forgot-password') {
			registeredData = {
				email: inputs[0].value,
			};
		}
		return registeredData;
	};

	const sendFormData = async (event) => {
		if (!!event) event.preventDefault();
		let headers = {
			'Content-type': 'application/json',
		};
		if (pageName !== 'login') headers.authorization = `Bearer ${userContext.token}`;
		dispatch({ payload: { type: 'loading', status: true } });
		let resultData = await httpRequestHandler(
			`http://localhost:5000/api/user/${pageName}`,
			'POST',
			JSON.stringify(registeredData(formState.inputs)),
			headers,
		);
		dispatch({ payload: { type: 'loading', status: false } });
		if (resultData.error && pageName === 'login')
			dispatch({ payload: { type: 'server-error', status: true } });
		if (resultData.password || resultData.usernameOrEmail)
			dispatch({ payload: { type: 'login-error', status: true } });
		if (resultData.error === 'Token expired') {
			userContext.userData.logout(true);
			navigate('/');
			return;
		}
		return resultData;
	};

	function reducer(formState, action) {
		const validateInput = (name, value) => {
			let errorMessage = '';
			if (!value.length) errorMessage = 'Complete el campo.';
			if (name === 'password' && value.length < 3)
				errorMessage = 'La contraseña debe ser de al menos 3 caracteres.';
			return errorMessage;
		};

		const validateForm = (inputs) => {
			let inputsValidation = inputs
				.map((i) => (!i.errorMessage.length && i.value.length ? true : false))
				.filter((i) => i === false);
			return inputsValidation.length ? false : true;
		};

		switch (action.payload.type) {
			case 'change': {
				let newInputs = [...formState.inputs];
				let inputIndex = newInputs.findIndex((i) => i.name === action.payload.inputName);
				newInputs[inputIndex].value = action.payload.value;
				newInputs[inputIndex].errorMessage = validateInput(
					action.payload.inputName,
					action.payload.value,
				);
				return { ...formState, inputs: newInputs, formIsValid: validateForm(newInputs) };
			}
			case 'loading': {
				return { ...formState, loading: action.payload.status };
			}
			case 'login-error': {
				return {
					...formState,
					loginError: action.payload.status,
					formIsValid: false,
				};
			}
			case 'server-error': {
				return { ...formState, serverError: action.payload.status };
			}

			default:
				break;
		}
	}

	return {
		formState,
		sendFormData,
		dispatch,
	};
};

export default useForm;

// function registeredData(inputs) {
// 	let registeredData = {};
// 	if (pageName === 'register')
// 		registeredData = {
// 			username: inputs[0].value,
// 			lastName: inputs[1].value,
// 			firstName: inputs[2].value,
// 			ni: inputs[3].value,
// 			hierarchy: inputs[4].value,
// 			section: inputs[5].value,
// 			guardId: inputs[6].value,
// 			superior: inputs[7].value,
// 			email: inputs[8].value,
// 			password: inputs[9].value,
// 			repeatPassword: inputs[10].value,
// 		};
// 	if (pageName === 'login') {
// 		registeredData = {
// 			usernameOrEmail: inputs[0].value,
// 			password: inputs[1].value,
// 		};
// 	}
// 	if (pageName === 'change-password') {
// 		registeredData = {
// 			currentPassword: inputs[0].value,
// 			newPassword: inputs[1].value,
// 			repeatNewPassword: inputs[2].value,
// 		};
// 	}
// 	if (pageName === 'forgot-password') {
// 		registeredData = {
// 			email: inputs[0].value,
// 		};
// 	}
// 	return registeredData;
// }

// const validateData = (validateType, inputIndex, newInputs, value) => {
// 	let joiValidation = schema.validate(registeredData(newInputs), {
// 		abortEarly: false,
// 	});
// 	let formIsValid = true;
// 	console.log(joiValidation);

// 	if (joiValidation.error) {
// 		formIsValid = false;

// 		const searchErrorIndex = (name) =>
// 			joiValidation.error.details.findIndex((error) => error.context.label === name);

// 		if (validateType === 'input') {
// 			let errorIndex = searchErrorIndex(newInputs[inputIndex].name);
// 			if (errorIndex !== -1)
// 				newInputs[inputIndex].errorMessage = joiValidation.error.details[errorIndex].message;
// 			if (newInputs[inputIndex].name === 'repetirContraseña' && !value)
// 				newInputs[inputIndex].errorMessage = 'Repita su contraseña.';
// 		}

// 		if (validateType === 'form') {
// 			newInputs.forEach((input) => {
// 				let errorIndex = searchErrorIndex(input.name);
// 				if (errorIndex !== -1)
// 					input.errorMessage = joiValidation.error.details[errorIndex].message;
// 				if (input.name === 'repeatPassword' && !input.value)
// 					input.errorMessage = ['Repita su contraseña.'];
// 			});
// 		}
// 	}

// 	setInputs(newInputs);
// 	setFormIsValid(formIsValid);

// 	return formIsValid;
// };

// const verifyField = (validateInputs) => {
// 	let newInputs = [...inputs];
// 	let verification = true;
// 	if (pageName === 'register') {
// 		if (validateInputs.username) {
// 			newInputs[0].errorMessage = 'El nombre de usuario ya está registrado.';
// 		}
// 		if (validateInputs.email) {
// 			newInputs[6].errorMessage = 'El correo electrónico ya está registrado.';
// 		}
// 		verification = false;
// 	}
// 	if (pageName === 'login') {
// 		if (validateInputs.usernameOrEmail || validateInputs.password) verification = false;
// 		setLoginError(true);
// 	}

// 	setFormIsValid(verification);
// 	setInputs(newInputs);
// 	return verification;
// };

// const changeHandler = async (event) => {
// 	let inputIndex =
// 		event.target.getAttribute('name') === 'section'
// 			? inputs.findIndex((f) => f.name === event.target.getAttribute('name'))
// 			: inputs.findIndex((f) => f.name === event.target.name);
// 	let newInputs = [...inputs];
// 	newInputs[inputIndex].errorMessage = '';
// 	event.target.getAttribute('name') === 'section'
// 		? (newInputs[inputIndex].value = event.target.getAttribute('value'))
// 		: (newInputs[inputIndex].value = event.target.value);
// 	console.log(inputIndex);
// 	console.log(event.target.value);
// 	validateData('input', inputIndex, newInputs, event.target.value);
// };

// const validateForm = async (event) => {
// 	if (!!event) event.preventDefault();
// 	let newInputs = [...inputs];
// 	let userDataResult = validateData('form', null, newInputs, event);
// 	if (userDataResult) {
// 		let databaseResult = await sendFormData(registeredData(newInputs));
// 		if (databaseResult.validInputs) sendUserForm(databaseResult.resultData, newInputs[0].value);
// 	}
// };
