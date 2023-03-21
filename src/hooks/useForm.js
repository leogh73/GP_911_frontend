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
import { FaBuilding } from 'react-icons/fa';
import { MdSupervisorAccount } from 'react-icons/md';

const useForm = (pageName, sendUserForm, profileData, section) => {
	const { loadUser } = useRememberMe();
	const { httpRequestHandler } = useHttpConnection();
	const userContext = useContext(UserContext);
	const storedUser = loadUser();
	const navigate = useNavigate();

	const userData = !!profileData ? profileData : userContext.userData;
	const ownProfile = !!profileData ? false : true;

	// console.log(profileData);

	const userSection = (s) => {
		let userSection;
		if (s === 'Phoning') userSection = 'Telefonía';
		if (s === 'Monitoring') userSection = 'Monitoreo';
		if (s === 'Dispatch') userSection = 'Despacho';
		return userSection;
	};

	const formInputs = () => {
		// console.log(userData);
		let formInputs;
		if (pageName === 'register') {
			formInputs = [...registerInputs];
			formInputs.splice(5, 1);
		}
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
			formInputs = [...registerInputs];
			formInputs.splice(9, 2);
		}
		return formInputs;
	};

	useEffect(() => {
		if (pageName === 'profile-edit') dispatch({ type: 'load profile-edit' });
	}, [pageName]);

	const [state, dispatch] = useReducer(reducer, {
		inputs: formInputs(),
		formIsValid: false,
		loading: false,
		loginError: false,
		registerError: false,
		serverError: false,
	});

	const registeredData = (inputs) => {
		let registeredData = {};
		if (pageName === 'register') {
			console.log(inputs);
			registeredData = {
				username: inputs[0].value,
				lastName: inputs[1].value,
				firstName: inputs[2].value,
				ni: inputs[3].value,
				hierarchy: inputs[4].value,
				section,
				guardId: inputs[5].value,
				superior: inputs[6].value,
				email: inputs[7].value,
				password: inputs[8].value,
				repeatPassword: inputs[9].value,
			};
		}
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
		if (pageName === 'profile-edit') {
			registeredData = {
				newUserName: inputs[0].value !== userData.username ? inputs[0].value : null,
				newLastName: inputs[1].value !== userData.lastName ? inputs[1].value : null,
				newFirstName: inputs[2].value !== userData.firstName ? inputs[2].value : null,
				newNi: inputs[3].value !== userData.ni ? inputs[3].value : null,
				newHierarchy: inputs[4].value !== userData.hierarchy ? inputs[4].value : null,
				newGuardId: inputs[5].value !== userData.guardId ? inputs[5].value : null,
				newSection: inputs[6].value !== userData.guardId ? inputs[6].value : null,
				newSuperior: inputs[7].value !== userData.superior ? inputs[7].value : null,
				newEmail: inputs[8].value !== userData.email ? inputs[8].value : null,
			};
		}
		if (pageName === 'forgot-password') {
			registeredData = {
				email: inputs[0].value,
			};
		}
		console.log(registeredData);

		return registeredData;
	};

	const submitForm = async (event) => {
		if (!!event) event.preventDefault();
		let headers = {
			'Content-type': 'application/json',
		};
		if (pageName !== 'login') headers.authorization = `Bearer ${userContext.token}`;
		dispatch({ type: 'loading', payload: { status: true } });
		let resultData = await httpRequestHandler(
			`http://localhost:5000/api/user/${pageName}`,
			'POST',
			JSON.stringify(registeredData(state.inputs)),
			headers,
		);
		dispatch({ type: 'loading', payload: { status: false } });
		console.log(resultData);
		if (resultData.error === 'server') {
			return dispatch({ type: 'server error', payload: { status: true } });
		}
		if (pageName === 'login' && resultData.error) {
			return dispatch({ type: 'login error', payload: { status: true } });
		}
		if (pageName === 'register' && resultData.error) {
			return dispatch({ type: 'register error', payload: { status: true } });
		}
		if (resultData.error === 'Token expired') {
			userContext.userData.logout(true);
			return navigate('/');
		}
		state.inputs.forEach((i) => {
			i.value = '';
			i.errorMessage = '';
		});
		sendUserForm(resultData, state.inputs[0].value);
	};

	function reducer(state, action) {
		const validateInput = (name, value) => {
			let errorMessage = '';
			if (!value.length) {
				errorMessage = 'Complete el campo.';
			}
			if (name === 'ni') {
				if ((!!value && isNaN(+value)) || (!isNaN(+value) && value.length < 3)) {
					errorMessage = 'El NI es inválido';
				}
			}
			if (name === 'firstName' || name === 'lastName' || name === 'hierarchy') {
				let splittedValue = value.split(' ');
				splittedValue.forEach((v) => {
					if (v.length === 1 && v === v.toLowerCase()) {
						if (name === 'firstName') errorMessage = 'El nombre debe comenzar con mayúsculas.';
						if (name === 'lastName') errorMessage = 'El apellido debe comenzar con mayúsculas.';
						if (name === 'hierarchy') errorMessage = 'La jerarquía debe comenzar con mayúsculas.';
					}
					if (
						(v.length === 1 && v === v.toUpperCase()) ||
						(v.length && v[0] === v[0].toUpperCase() && v.length < 3)
					) {
						if (name === 'firstName') errorMessage = 'El nombre es inválido';
						if (name === 'lastName') errorMessage = 'El apellido es inválido.';
						if (name === 'hierarchy') errorMessage = 'La jerarquía es inválida.';
					}
				});
			}
			if (name === 'guardId') {
				if (value.length > 1) {
					errorMessage = 'La guardia ingresada es incorrecta.';
				}
				if (value.length === 1 && isNaN(+value) && value === value.toLowerCase()) {
					errorMessage = 'La guarda debe ser una letra mayúscula o un número de un dígito.';
				}
			}
			if (
				name === 'email' &&
				value.length &&
				!value.match(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/)
			) {
				errorMessage = 'El correo electrónico ingresado es inválido.';
			}
			if (name === 'password' || name === 'newPassword' || name === 'currentPassword') {
				if (value.length && value.length < 3)
					errorMessage = 'La contraseña deben ser al menos 3 caracteres.';
			}
			if (
				name === 'newPassword' &&
				value.length === state.inputs[1].value.length &&
				value === state.inputs[0].value
			) {
				errorMessage = 'La nueva contraseña no puede ser igual a la actual.';
			}
			if (
				name === 'newPassword' &&
				state.inputs[2].value.length &&
				value !== state.inputs[2].value
			) {
				errorMessage = 'La nueva contraseña no coincide.';
			}
			if (
				(name === 'password' &&
					state.inputs[state.inputs.findIndex((i) => i.name === 'repeatPassword')]?.value.length &&
					value !==
						state.inputs[state.inputs.findIndex((i) => i.name === 'repeatPassword')].value) ||
				(name === 'repeatPassword' &&
					value.length &&
					value !== state.inputs[state.inputs.findIndex((i) => i.name === 'password')].value) ||
				(name === 'repeatNewPassword' && value.length && value !== state.inputs[1].value)
			) {
				errorMessage = 'La contraseña no coincide.';
			}
			return errorMessage;
		};

		const validateForm = (inputs) => {
			console.log(inputs);
			let guardIndex = inputs.findIndex((i) => i.name === 'guardId');
			if (pageName === 'register' || pageName === 'profile-edit') {
				if (inputs[inputs.findIndex((i) => i.name === 'superior')].value === 'Si') {
					inputs[guardIndex].value = '-';
					inputs[guardIndex].errorMessage = '';
					inputs[guardIndex].disabled = true;
				}
				if (inputs[state.inputs.findIndex((i) => i.name === 'superior')].value === 'No') {
					inputs[guardIndex].value =
						inputs[guardIndex].value === '-' ? '' : inputs[guardIndex].value;
					inputs[guardIndex].disabled = false;
				}
			}
			if (pageName === 'change-password') {
				if (
					inputs[1].value.length &&
					inputs[2].value.length &&
					inputs[1].value === state.inputs[2].value
				) {
					inputs[1].errorMessage = '';
					inputs[2].errorMessage = '';
				}
			}
			let isValid = true;
			inputs.forEach((i) => {
				console.log(i.value.toString().length);
				if (i.errorMessage.length || !i.value.toString().length) isValid = false;
			});
			if (pageName === 'profile-edit') {
				let superior = userData.superior ? 'Si' : 'No';
				if (
					inputs[0].value === userData.username &&
					inputs[1].value === userData.lastName &&
					inputs[2].value === userData.firstName &&
					inputs[3].value === userData.ni &&
					inputs[4].value === userData.hierarchy &&
					inputs[5].value === userSection(userData.section) &&
					inputs[6].value === userData.guardId &&
					inputs[7].value === superior &&
					inputs[8].value === userData.email
				)
					isValid = false;
			}
			return isValid;
		};

		switch (action.type) {
			case 'change': {
				let newInputs = [...state.inputs];
				let inputIndex = newInputs.findIndex((i) => i.name === action.payload.inputName);
				newInputs[inputIndex].value = action.payload.value;
				newInputs[inputIndex].errorMessage = validateInput(
					action.payload.inputName,
					action.payload.value,
				);
				return { ...state, inputs: newInputs, formIsValid: validateForm(newInputs) };
			}
			case 'load profile-edit': {
				let newInputs = [...state.inputs];
				newInputs[0].value = userData.username;
				newInputs[1].value = userData.lastName;
				newInputs[2].value = userData.firstName;
				newInputs[3].value = userData.ni;
				newInputs[4].value = userData.hierarchy;
				newInputs[5].value = userSection(userData.section);
				newInputs[6].value = !!userData.guardId ? userData.guardId : '-';
				newInputs[7].value = userData.superior ? 'Si' : 'No';
				newInputs[8].value = userData.email;
				return { ...state, inputs: newInputs };
			}
			case 'loading': {
				return { ...state, loading: action.payload.status };
			}
			case 'login error': {
				return {
					...state,
					loginError: action.payload.status,
					formIsValid: false,
				};
			}
			case 'register error': {
				return {
					...state,
					registerError: action.payload.status,
					formIsValid: false,
				};
			}
			case 'server error': {
				return { ...state, serverError: action.payload.status };
			}
			default:
				break;
		}
	}

	return {
		state,
		submitForm,
		dispatch,
	};
};

export default useForm;
