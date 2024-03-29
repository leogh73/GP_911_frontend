import { useEffect, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useRequestLoad = (sendResult) => {
	const userContext = useContext(UserContext);
	const { httpRequestHandler } = useHttpConnection();

	function reducer(state, action) {
		switch (action.type) {
			case 'load request data': {
				return {
					...state,
					data: {
						...state.data,
						requestData: action.payload.data,
					},
				};
			}
			case 'load offer data': {
				return {
					...state,
					data: {
						...state.data,
						offerData: action.payload.data,
					},
				};
			}
			case 'load comment': {
				return {
					...state,
					data: {
						...state.data,
						comment: action.payload.comment,
					},
				};
			}
			case 'loading': {
				return { ...state, loading: action.payload.status };
			}
			case 'data is valid': {
				return { ...state, dataIsValid: action.payload.status };
			}
			default:
				break;
		}
	}

	const [state, dispatch] = useReducer(reducer, {
		data: {
			type: 'request',
			name: `${userContext.userData.lastName} ${userContext.userData.firstName}`,
			requestData: {
				date: '-',
				shift: '-',
				day: '-',
				guardId: '-',
			},
			offerData: {
				date: '-',
				shift: '-',
				day: '-',
				guardId: '-',
			},
			comment: '-',
		},
		loading: false,
		dataIsValid: false,
	});

	const loadDate = useCallback(
		(data, section) => {
			section === 'request'
				? dispatch({
						type: 'load request data',
						payload: { data },
				  })
				: dispatch({
						type: 'load offer data',
						payload: { data },
				  });
		},
		[dispatch],
	);

	const sendNewChange = async () => {
		try {
			dispatch({ type: 'loading', payload: { status: true } });
			let consult = await httpRequestHandler('item/new', 'POST', JSON.stringify(state.data), {
				authorization: `Bearer ${userContext.token}`,
				'Content-type': 'application/json',
			});
			if (consult.error === 'Not authorized') {
				return userContext.logout(true);
			}
			if (consult.newAccessToken) {
				const newUserData = { ...userContext.userData, token: consult.newAccessToken };
				userContext.login(newUserData);
			}
			sendResult(consult.result);
		} catch (error) {
			toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
			console.log(error);
		} finally {
			dispatch({ type: 'loading', payload: { status: false } });
		}
	};

	const sendDataCallback = useCallback(() => {
		let formData = [Object.entries(state.data.requestData).map((data) => data[1])].flat(1);
		let isValid = true;
		formData.forEach((data) => {
			if (data === '-') isValid = false;
		});
		dispatch({ type: 'data is valid', payload: { status: isValid } });
	}, [state.data]);

	useEffect(() => {
		sendDataCallback();
	}, [state.data, sendDataCallback]);

	return {
		state,
		dispatch,
		loadDate,
		sendNewChange,
	};
};

export default useRequestLoad;
