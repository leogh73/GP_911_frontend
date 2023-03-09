import { useCallback, useContext, useEffect, useState } from 'react';
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

	const userData = profileData ?? userContext.userData;
	const ownProfile = !!profileData ? false : true;

	const userSection = () => {
		let userSection;
		if (userData.section === 'Phoning') userSection = 'Teléfonía';
		if (userData.section === 'Monitoring') userSection = 'Monitoreo';
		if (userData.section === 'Dispatch') userSection = 'Despacho';
		return userSection;
	};

	const requestedInputs = useCallback((inputs) => {
		let finalInputs = [...inputs];

		if (pageName === 'register' && userData.superior) {
			finalInputs[5].optionsList = [];
			finalInputs[5].value = userSection(userData.section);
			finalInputs[5].disabled = true;

			finalInputs[7].optionsList = [];
			finalInputs[7].value = 'No';
			finalInputs[7].disabled = true;
		}

		if (pageName === 'profile-edit') {
			finalInputs.forEach((i) => (i.disabled = true));
			finalInputs[0].value = userData.username;
			finalInputs[1].value = userData.lastName;
			finalInputs[2].value = userData.firstName;
			finalInputs[3].value = userData.ni;
			finalInputs[4].value = userData.hierarchy;
			finalInputs[5].value = userSection();
			finalInputs[6].value = userData.guardId;
			finalInputs[7].value = userData.superior;
			finalInputs[8].value = userData.email;
			finalInputs.splice(9, 2);

			if (
				(ownProfile && !userData.superior && !userData.admin) ||
				(ownProfile && userData.superior && !userData.admin)
			) {
				finalInputs[0].placeHolder = userData.username;
				finalInputs[0].disabled = false;
				finalInputs[0].value = '';
				finalInputs[5].optionsList = [];
				finalInputs[6].value = '-';
				finalInputs[7].optionsList = [];
				finalInputs[7].value = userData.superior ? 'Si' : 'No';
				finalInputs[8].disabled = false;
			}

			if (userData.superior) {
			}
		}
		// 	if ((superior && profile.own) || (!superior && profile.own)) {
		// 		finalInputs[0].disabled = false;
		// 		finalInputs[7].disabled = false;
		// 		finalInputs[8].disabled = false;
		// 	}
		// 	if (superior && !profile.own) {
		// 		finalInputs[5].disabled = false;
		// 		finalInputs[6].disabled = false;
		// 	}
		// 	console.log(inputs);
		// }

		// console.log(inputs);

		return finalInputs;
	}, []);

	useEffect(() => {
		let schema = registerSchema;
		let formInputs = [];
		if (pageName === 'register') {
			formInputs = requestedInputs(registerInputs);
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
		if (pageName === 'profile-edit') {
			formInputs = requestedInputs(registerInputs);
			console.log(formInputs);
			// 	formInputs = startInputs.map((input) => {
			// 		input.disabled = true;
			// 	});
			// 	formInputs[0].value = userContext.userData.username;
			// 	formInputs[1].value = userContext.userData.lastName;
			// 	formInputs[2].value = userContext.userData.firstName;
			// 	formInputs[3].value = userContext.userData.ni;
			// 	formInputs[4].value = userContext.userData.hierarchy;
			// 	formInputs[5].value = userContext.userData.section;
			// 	formInputs[6].value = userContext.userData.guardId;
			// 	formInputs[7].value = userContext.userData.email;
			// 	formInputs[8].value = userContext.userData.username;
		}
		setSchema(schema);
		setInputs(formInputs);
		return () => {
			formInputs.forEach((i) => (i.value = ''));
		};
	}, [pageName, storedUser, userContext, requestedInputs]);

	function registeredData(inputs) {
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
	}

	const sendFormData = async (data) => {
		setLoading(true);
		let resultData = await httpRequestHandler(
			`http://localhost:5000/api/user/${pageName}`,
			'POST',
			JSON.stringify(data),
			{
				'Content-type': 'application/json',
			},
		);
		setLoading(false);
		if (resultData.error && pageName === 'login') {
			setServerError(true);
			return resultData;
		}
		if (resultData.error === 'Token expired') {
			userContext.userData.logout(true);
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
		console.log(joiValidation);

		if (joiValidation.error) {
			formIsValid = false;

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
		console.log(inputIndex);
		console.log(event.target.value);
		validateData('input', inputIndex, newInputs, event.target.value);
	};

	const validateForm = async (event) => {
		if (!!event) event.preventDefault();
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
