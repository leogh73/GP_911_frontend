import { useContext, useEffect, useState } from 'react';
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

const useForm = (pageName, sendUserForm) => {
	const { loadUser } = useRememberMe();
	const [formIsValid, setFormIsValid] = useState(false);
	const { httpRequestHandler } = useHttpConnection();
	const [loading, setLoading] = useState(false);
	const [loginError, setLoginError] = useState(false);
	const [serverError, setServerError] = useState(false);
	const userContext = useContext(UserContext);
	const storedUser = loadUser();
	const navigate = useNavigate();
	const [inputs, setInputs] = useState([]);
	const [schema, setSchema] = useState();

	useEffect(() => {
		let schema;
		let formInputs = [];
		if (pageName === 'register') {
			formInputs = registerInputs(userContext.userData.admin);
			schema = registerSchema;
			console.log(formInputs);
		}
		if (pageName === 'login') {
			formInputs = loginInputs;
			schema = loginSchema;
			formInputs[0].value = storedUser ? storedUser : '';
		}
		if (pageName === 'change-password') {
			formInputs = passwordInputs('change');
			schema = passwordSchema('change');
		}
		if (pageName === 'forgot-password') {
			formInputs = passwordInputs('forgot');
			schema = passwordSchema('forgot');
		}
		// if (pageName === 'profile') {
		// 	formInputs = registerInputs(userContext.userData.admin).map((input)=>{input.disabled===true});
		// 	schema = registerSchema;
		// }
		setSchema(schema);
		setInputs(formInputs);
		return () => {
			formInputs.forEach((field) => (field.value = ''));
		};
	}, [pageName, storedUser]);

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
	}

	const sendFormData = async (data) => {
		setLoading(true);
		let resultData = await httpRequestHandler(
			`http://localhost:5000/api/user/${pageName}`,
			'POST',
			JSON.stringify(data),
			{ authorization: `Bearer ${userContext.token}`, 'Content-type': 'application/json' },
		);
		setLoading(false);
		if (resultData.error && pageName === 'login') {
			setServerError(true);
			return resultData;
		}
		if (resultData.error === 'Token expired') {
			userContext.logout(true);
			navigate('/');
			return;
		}
		let validInputs = verifyField(resultData);
		return { resultData, validInputs };
	};

	const validateData = (validateType, inputIndex, newInputs, value) => {
		let joiValidation = schema.validate(registeredData(newInputs), {
			abortEarly: false,
		});
		let formIsValid = true;

		if (joiValidation.error) {
			formIsValid = false;

			console.log(joiValidation.error.details);

			const searchErrorIndex = (name) =>
				joiValidation.error.details.findIndex((error) => error.context.label === name);

			if (validateType === 'input') {
				let errorIndex = searchErrorIndex(newInputs[inputIndex].name);
				if (errorIndex !== -1)
					newInputs[inputIndex].errorMessage = joiValidation.error.details[errorIndex].message;
				if (newInputs[inputIndex].name === 'repetirContraseña' && !value)
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
			}
			if (validateInputs.email) {
				newInputs[6].errorMessage = 'El correo electrónico ya está registrado.';
			}
			verification = false;
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
		validateData('input', inputIndex, newInputs, event.target.value);
	};

	const validateForm = async (event) => {
		event.preventDefault();
		let newInputs = [...inputs];
		let userDataResult = validateData('form', null, newInputs, event);
		if (userDataResult) {
			let databaseResult = await sendFormData(registeredData(newInputs));
			if (databaseResult.validInputs) sendUserForm(databaseResult.resultData, newInputs[0].value);
		}
	};

	return {
		inputs,
		changeHandler,
		validateForm,
		formIsValid,
		loading,
		loginError,
		setLoginError,
		serverError,
		setServerError,
	};
};

export default useForm;
