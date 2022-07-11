import { useState } from 'react';
import registerInputs from '../inputFields/RegisterInputs';
import loginInputs from '../inputFields/LoginInputs';
import registerSchema from '../schemas/RegisterForm';
import loginSchema from '../schemas/LoginForm';
import useHttpConnection from './useHttpConnection';
import useRememberMe from './useRememberMe';

const useFormularios = (pageName, sendUserForm) => {
	const { loadUser } = useRememberMe();
	const [inputs, setInputs] = useState([]);
	const [formIsValid, setFormIsValid] = useState(false);
	const { loading, httpRequestHandler } = useHttpConnection();

	let schema;
	const loadStartInputs = () => {
		let loadedInputs;
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
		setInputs(loadedInputs);
	};

	function registeredData(inputs) {
		let registeredData = {};
		if (pageName === 'register')
			registeredData = {
				username: inputs[0].value,
				lastName: inputs[1].value,
				firstName: inputs[2].value,
				ni: inputs[3].value,
				section: inputs[4].value,
				guard: inputs[5].value,
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
		console.log(resultData);
		let validInputs = verifyField(resultData);
		return { resultData, validInputs };
	};

	const clearInputInputs = () => {
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
			if (validateInputs.user === true) {
				newInputs[0].errorMessage = 'El nombre de usuario ya está registrado.';
				verification = false;
			}
			if (validateInputs.correoElectronico === true) {
				newInputs[6].errorMessage = 'El correo electrónico ya está registrado.';
				verification = false;
			}
		}
		if (pageName === 'login') {
			if (validateInputs.usernameOrEmail === false) {
				newInputs[0].errorMessage = validateInputs.message;
				verification = false;
			}
			if (validateInputs.password === false && newInputs[0].errorMessage === '') {
				newInputs[1].errorMessage = 'La contraseña ingresada es incorrecta.';
				verification = false;
			}
		}
		setInputs(newInputs);
		setFormIsValid(verification);
		return verification;
	};

	const changeHandler = async (event) => {
		let inputIndex = inputs.findIndex((f) => f.name === event.target.name);
		let newInputs = [...inputs];
		newInputs[inputIndex].errorMessage = '';
		newInputs[inputIndex].value = event.target.value;
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
				clearInputInputs();
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
	};
};

export default useFormularios;
