import { useContext, useEffect, useReducer } from 'react';
import loginInputs from '../inputFields/LoginInputs';
import passwordInputs from '../inputFields/PasswordInputs';
import registerInputs from '../inputFields/RegisterInputs';
import useHttpConnection from './useHttpConnection';
import useRememberMe from './useRememberMe';
import UserContext from '../context/UserContext';
import { BiCommentDetail } from 'react-icons/bi';

const useForm = (sendUserForm, pageName, profile) => {
	const { loadUser } = useRememberMe();
	const userContext = useContext(UserContext);
	const { httpRequestHandler } = useHttpConnection();
	const storedUser = loadUser();

	let ownProfile = profile?.data?._id === userContext.userData?._id ? true : false;

	const [state, dispatch] = useReducer(reducer, {
		inputs: [],
		formIsValid: false,
		error: { status: false, type: null },
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
				section: profile.section,
				guardId: state.inputs[5].value,
				superior: state.inputs[6].value,
				email: state.inputs[7].value,
				password: state.inputs[8].value,
				repeatPassword: state.inputs[9].value,
			};
		}
		if (pageName === 'login') {
			registeredData = {
				usernameOrEmail: state.inputs[0].value.trim(),
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
			let superior = profile.data.superior ? 'Si' : 'No';
			registeredData = {
				userId: profile.data._id,
				changeToken: null,
				username: {
					previous: profile.data.username,
					new: state.inputs[0].value !== profile.data.username ? state.inputs[0].value : null,
				},
				lastName: {
					previous: profile.data.lastName,
					new: state.inputs[1].value !== profile.data.lastName ? state.inputs[1].value : null,
				},
				firstName: {
					previous: profile.data.firstName,
					new: state.inputs[2].value !== profile.data.firstName ? state.inputs[2].value : null,
				},
				ni: {
					previous: profile.data.ni,
					new: state.inputs[3].value !== profile.data.ni ? state.inputs[3].value : null,
				},
				hierarchy: {
					previous: profile.data.hierarchy,
					new: state.inputs[4].value !== profile.data.hierarchy ? state.inputs[4].value : null,
				},
				section: {
					previous: userSection(profile.data.section),
					new:
						state.inputs[5].value !== userSection(profile.data.section)
							? state.inputs[5].value
							: null,
				},
				guardId: {
					previous: profile.data.guardId,
					new: state.inputs[6].value !== profile.data.guardId ? state.inputs[6].value : null,
				},
				superior: {
					previous: profile.data.superior ? 'Si' : 'No',
					new: state.inputs[7].value !== superior ? state.inputs[7].value : null,
				},
				email: {
					previous: profile.data.email,
					new: state.inputs[8].value !== profile.data.email ? state.inputs[8].value : null,
				},
				comment: state.inputs[9].value,
			};
		}
		if (pageName === 'forgot-password') {
			registeredData = {
				email: state.inputs[0].value,
			};
		}
		if (pageName === 'new-password') {
			registeredData = {
				userId: profile.userId,
				newPassword: state.inputs[0].value,
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
			`user/${pageName}`,
			'POST',
			JSON.stringify(formData),
			headers,
		);
		dispatch({ type: 'loading', payload: { status: false } });
		if (resultData.error)
			return dispatch({ type: 'error', payload: { status: true, type: resultData.error } });
		if (resultData.error === 'Not authorized') {
			return userContext.profile.data.logout(true);
		}
		state.inputs.forEach((i) => {
			i.value = '';
			i.errorMessage = '';
		});
		let extraData;
		if (pageName === 'login') extraData = formData.usernameOrEmail;
		if (pageName === 'profile-edit') extraData = ownProfile;
		if (resultData.newAccessToken) {
			const newUserData = { ...userContext.userData, token: resultData.newAccessToken };
			userContext.login(newUserData);
		}
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
			if (pageName !== 'new-password') {
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
			}
			if (
				(name === 'password' &&
					state.inputs[state.inputs.findIndex((i) => i.name === 'repeatPassword')]?.value.length &&
					value !==
						state.inputs[state.inputs.findIndex((i) => i.name === 'repeatPassword')].value) ||
				(name === 'repeatPassword' &&
					value.length &&
					value !== state.inputs[state.inputs.findIndex((i) => i.name === 'password')].value) ||
				(name === 'repeatNewPassword' &&
					value.length &&
					(value !== state.inputs[1].value || value !== state.inputs[0].value))
			) {
				errorMessage = 'La contraseña no coincide.';
			}
			return errorMessage;
		};

		const validateForm = (inputs) => {
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
				if ((i.errorMessage.length || !i.value.toString().length) && i.name !== 'comment')
					isValid = false;
			});
			if (pageName === 'profile-edit') {
				let superior = profile.data.superior ? 'Si' : 'No';
				if (
					inputs[0].value === profile.data.username &&
					inputs[1].value === profile.data.lastName &&
					inputs[2].value === profile.data.firstName &&
					inputs[3].value === profile.data.ni &&
					inputs[4].value === profile.data.hierarchy &&
					inputs[5].value === userSection(profile.section) &&
					inputs[6].value === profile.data.guardId &&
					inputs[7].value === superior &&
					inputs[8].value === profile.data.email
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
				if (pageName === 'new-password') {
					formInputs = passwordInputs('new');
				}
				if (pageName === 'profile-edit') {
					formInputs = [...registerInputs];
					formInputs.splice(9, 2);
					formInputs[0].value = profile.data.username;
					formInputs[1].value = profile.data.lastName;
					formInputs[2].value = profile.data.firstName;
					formInputs[3].value = profile.data.ni;
					formInputs[4].value = profile.data.hierarchy;
					formInputs[5].value = userSection(profile.data.section);
					formInputs[6].value = !!profile.data.guardId ? profile.data.guardId : '-';
					formInputs[7].value = profile.data.superior ? 'Si' : 'No';
					formInputs[8].value = profile.data.email;
					if (!userContext.userData.admin && ownProfile) {
						formInputs[3].disabled = true;
						formInputs[4].disabled = true;
						formInputs[5].optionsList = [];
						formInputs[5].disabled = true;
						formInputs[6].disabled = true;
						formInputs[7].optionsList = [];
						formInputs[7].disabled = true;
					}
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
			case 'error': {
				return {
					...state,
					error: {
						status: action.payload.status,
						type: action.payload.type,
					},
					formIsValid: false,
				};
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
