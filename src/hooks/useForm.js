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
import { BiCommentDetail } from 'react-icons/bi';

const useForm = (pageName, sendUserForm, profileData, section) => {
	const { loadUser } = useRememberMe();
	const { httpRequestHandler } = useHttpConnection();
	const userContext = useContext(UserContext);
	const storedUser = loadUser();
	const navigate = useNavigate();

	let ownProfile = profileData?.userId === userContext?.userData?.userId ? true : false;
	console.log(profileData?.userId);
	console.log(userContext?.userData?.userId);

	const [state, dispatch] = useReducer(reducer, {
		inputs: [],
		formIsValid: false,
		loading: false,
		loginError: false,
		registerError: false,
		serverError: false,
	});

	useEffect(() => {
		dispatch({ type: 'load start inputs' });
	}, []);

	const registeredData = () => {
		let registeredData = {};
		if (pageName === 'register') {
			registeredData = {
				username: state.inputs[0].value,
				lastName: state.inputs[1].value,
				firstName: state.inputs[2].value,
				ni: state.inputs[3].value,
				hierarchy: state.inputs[4].value,
				section,
				guardId: state.inputs[5].value,
				superior: state.inputs[6].value,
				email: state.inputs[7].value,
				password: state.inputs[8].value,
				repeatPassword: state.inputs[9].value,
			};
		}
		if (pageName === 'login') {
			registeredData = {
				usernameOrEmail: state.inputs[0].value,
				password: state.inputs[1].value,
			};
		}
		if (pageName === 'change-password') {
			registeredData = {
				currentPassword: state.inputs[0].value,
				newPassword: state.inputs[1].value,
				repeatNewPassword: state.inputs[2].value,
			};
		}
		if (pageName === 'profile-edit') {
			let superior = profileData.superior ? 'Si' : 'No';
			registeredData = {
				userId: profileData._id,
				username: {
					previous: profileData.username,
					new: state.inputs[0].value !== profileData.username ? state.inputs[0].value : null,
				},
				lastName: {
					previous: profileData.lastName,
					new: state.inputs[1].value !== profileData.lastName ? state.inputs[1].value : null,
				},
				firstName: {
					previous: profileData.firstName,
					new: state.inputs[2].value !== profileData.firstName ? state.inputs[2].value : null,
				},
				ni: {
					previous: profileData.ni,
					new: state.inputs[3].value !== profileData.ni ? state.inputs[3].value : null,
				},
				hierarchy: {
					previous: profileData.hierarchy,
					new: state.inputs[4].value !== profileData.hierarchy ? state.inputs[4].value : null,
				},
				section: {
					previous: userSection(profileData.section),
					new:
						state.inputs[5].value !== userSection(profileData.section)
							? state.inputs[5].value
							: null,
				},
				guardId: {
					previous: profileData.guardId,
					new: state.inputs[6].value !== profileData.guardId ? state.inputs[6].value : null,
				},
				superior: {
					previous: profileData.superior ? 'Si' : 'No',
					new: state.inputs[7].value !== superior ? state.inputs[7].value : null,
				},
				email: {
					previous: profileData.email,
					new: state.inputs[8].value !== profileData.email ? state.inputs[8].value : null,
				},
				comment: state.inputs[9].value,
			};
		}
		if (pageName === 'forgot-password') {
			registeredData = {
				email: state.inputs[0].value,
			};
		}

		return registeredData;
	};

	const userSection = (s) => {
		let userSection;
		if (s === 'Phoning') userSection = 'Telefonía';
		if (s === 'Monitoring') userSection = 'Monitoreo';
		if (s === 'Dispatch') userSection = 'Despacho';
		return userSection;
	};

	const submitForm = async (event) => {
		if (!!event) event.preventDefault();
		let formData = registeredData();
		let headers = {
			'Content-type': 'application/json',
		};
		if (pageName !== 'login') headers.authorization = `Bearer ${userContext.token}`;
		dispatch({ type: 'loading', payload: { status: true } });
		let resultData = await httpRequestHandler(
			`http://localhost:5000/api/user/${pageName}`,
			'POST',
			JSON.stringify(formData),
			headers,
		);
		dispatch({ type: 'loading', payload: { status: false } });
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
			userContext.profileData.logout(true);
			return navigate('/');
		}
		state.inputs.forEach((i) => {
			i.value = '';
			i.errorMessage = '';
		});
		let extraData;
		if (pageName === 'login') extraData = formData.usernameOrEmail;
		if (pageName === 'profile-edit') extraData = ownProfile;
		sendUserForm(resultData, extraData);
	};

	function reducer(state, action) {
		const userSection = (s) => {
			let userSection;
			if (s === 'Phoning') userSection = 'Telefonía';
			if (s === 'Monitoring') userSection = 'Monitoreo';
			if (s === 'Dispatch') userSection = 'Despacho';
			return userSection;
		};

		const validateInput = (name, value) => {
			let errorMessage = '';
			if (!value.length && name !== 'comment') {
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
				if ((i.errorMessage.length || !i.value.toString().length) && i.name !== 'comment')
					isValid = false;
			});
			if (pageName === 'profile-edit') {
				let superior = profileData.superior ? 'Si' : 'No';
				if (
					inputs[0].value === profileData.username &&
					inputs[1].value === profileData.lastName &&
					inputs[2].value === profileData.firstName &&
					inputs[3].value === profileData.ni &&
					inputs[4].value === profileData.hierarchy &&
					inputs[5].value === userSection(profileData.section) &&
					inputs[6].value === profileData.guardId &&
					inputs[7].value === superior &&
					inputs[8].value === profileData.email
				)
					isValid = false;
			}
			return isValid;
		};

		switch (action.type) {
			case 'load start inputs': {
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
					formInputs[0].value = profileData.username;
					formInputs[1].value = profileData.lastName;
					formInputs[2].value = profileData.firstName;
					formInputs[3].value = profileData.ni;
					formInputs[4].value = profileData.hierarchy;
					formInputs[5].value = userSection(profileData.section);
					formInputs[6].value = !!profileData.guardId ? profileData.guardId : '-';
					formInputs[7].value = profileData.superior ? 'Si' : 'No';
					formInputs[8].value = profileData.email;
					if (!userContext.userData.admin && ownProfile) {
						formInputs[3].disabled = true;
						formInputs[4].disabled = true;
						formInputs[5].optionsList = [];
						formInputs[5].disabled = true;
						formInputs[6].disabled = true;
						formInputs[7].optionsList = [];
						formInputs[7].disabled = true;
					}
					userContext.userData.admin &&
						formInputs.push({
							key: Math.random(),
							name: 'comment',
							optionsList: [],
							password: false,
							icon: <BiCommentDetail />,
							placeHolder: 'Comentario (opcional)',
							errorMessage: '',
							value: '',
							disabled: false,
						});
				}
				return { ...state, inputs: formInputs };
			}
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
			// case 'clear form': {
			// 	let newInputs = [...state.inputs];
			// 	newInputs.forEach((i) => {
			// 		i.value = '';
			// 		i.errorMessage = '';
			// 	});
			// 	return {
			// 		inputs: newInputs,
			// 		formIsValid: false,
			// 		loading: false,
			// 		loginError: false,
			// 		registerError: false,
			// 		serverError: false,
			// 	};
			// }
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
