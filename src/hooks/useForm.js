import { useState } from 'react';
import registerInputs from '../inputFields/RegisterInputs';
import loginInputs from '../inputFields/LoginInputs';
import registerSchema from '../schemas/RegisterForm';
import loginSchema from '../schemas/LoginForm';
import useHttpConnection from './useHttpConnection';

import useRememberMe from './useRememberMe';

const useForm = (pageName, sendUserForm) => {
	const { loadUser } = useRememberMe();
	const [formIsValid, setFormIsValid] = useState(false);
	const [loginError, setLoginError] = useState(false);
	const { loading, httpRequestHandler } = useHttpConnection();

	let schema;
	let loadedInputs = [];
	const loadStartInputs = () => {
		let storedUser = loadUser();
		if (pageName === 'register') {
			loadedInputs = registerInputs;
			schema = registerSchema;
		}
		if (pageName === 'login') {
			loadedInputs = loginInputs;
			schema = loginSchema;
			if (storedUser) loadedInputs[0].value = storedUser;
		}
		return loadedInputs;
	};

	const [inputs, setInputs] = useState(loadStartInputs());

	function registeredData(inputs) {
		let registeredData = {};
		if (pageName === 'register')
			registeredData = {
				username: inputs[0].value,
				lastName: inputs[1].value,
				firstName: inputs[2].value,
				ni: inputs[3].value,
				section: inputs[4].value,
				guardId: inputs[5].value,
				email: inputs[6].value,
				password: inputs[7].value,
				repeatPassword: inputs[8].value,
			};
		if (pageName === 'login') {
			registeredData = {
				usernameOrEmail: inputs[0].value,
				password: inputs[1].value,
			};
		}
		return registeredData;
	}

	const sendFormData = async (data) => {
		let resultData = await httpRequestHandler(
			`http://localhost:5000/api/user/${pageName}`,
			'POST',
			JSON.stringify(data),
			{ 'Content-type': 'application/json' },
		);
		let validInputs = verifyField(resultData);
		return { resultData, validInputs };
	};

	const clearInputTexts = () => {
		inputs.forEach((i) => (i.value = ''));
	};

	const validateData = (validateType, inputIndex, newInputs, event) => {
		let joiValidation = schema.validate(registeredData(newInputs), {
			abortEarly: false,
		});
		let formIsValid = true;

		if (joiValidation.error) {
			formIsValid = false;

			const searchErrorIndex = (name) =>
				joiValidation.error.details.findIndex((error) => error.context.label === name);

			if (validateType === 'input') {
				let errorIndex = searchErrorIndex(newInputs[inputIndex].name);
				if (errorIndex !== -1)
					newInputs[inputIndex].errorMessage = joiValidation.error.details[errorIndex].message;
				if (newInputs[inputIndex].name === 'repetirContraseña' && !event.target.value)
					newInputs[inputIndex].errorMessage = 'Repita su contraseña.';
			}

			if (validateType === 'form') {
				newInputs.forEach((input) => {
					let errorIndex = searchErrorIndex(input.name);
					if (errorIndex !== -1)
						input.errorMessage = joiValidation.error.details[errorIndex].message;
					if (input.name === 'repeatPassword' && !input.value)
						input.errorMessage = ['Repita su contraseña.'];
				});
			}
		}

		setInputs(newInputs);
		setFormIsValid(formIsValid);

		return formIsValid;
	};

	const verifyField = (validateInputs) => {
		let newInputs = [...inputs];
		let verification = true;
		if (pageName === 'register') {
			if (validateInputs.username) {
				newInputs[0].errorMessage = 'El nombre de usuario ya está registrado.';
				verification = false;
			}
			if (validateInputs.email) {
				newInputs[6].errorMessage = 'El correo electrónico ya está registrado.';
				verification = false;
			}
		}
		if (pageName === 'login') {
			if (validateInputs.usernameOrEmail || validateInputs.password) verification = false;
			setLoginError(true);
		}

		setFormIsValid(verification);
		setInputs(newInputs);
		return verification;
	};

	const changeHandler = async (event) => {
		let inputIndex =
			event.target.getAttribute('name') === 'section'
				? inputs.findIndex((f) => f.name === event.target.getAttribute('name'))
				: inputs.findIndex((f) => f.name === event.target.name);
		let newInputs = [...inputs];
		newInputs[inputIndex].errorMessage = '';
		event.target.getAttribute('name') === 'section'
			? (newInputs[inputIndex].value = event.target.getAttribute('value'))
			: (newInputs[inputIndex].value = event.target.value);
		validateData('input', inputIndex, newInputs, event);
	};

	const validateForm = async (event) => {
		event.preventDefault();
		let newInputs = [...inputs];
		let userDataResult = validateData('form', null, newInputs, event);
		if (userDataResult) {
			let databaseResult = await sendFormData(registeredData(newInputs));
			if (databaseResult.validInputs) {
				sendUserForm(databaseResult.resultData, newInputs[0].value);
				clearInputTexts();
			}
		}
	};

	return {
		inputs,
		loadStartInputs,
		changeHandler,
		validateForm,
		formIsValid,
		loading,
		loginError,
		setLoginError,
	};
};

export default useForm;
