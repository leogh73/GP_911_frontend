import { useEffect, useContext, useReducer, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useAffectedLoad = (sendResult) => {
	const userContext = useContext(UserContext);
	const navigate = useNavigate();
	const { httpRequestHandler } = useHttpConnection();

	function reducer(state, action) {
		switch (action.type) {
			case 'load affected data': {
				return {
					...state,
					data: {
						...state.data,
						affectedData: action.payload.data,
					},
				};
			}
			case 'load disaffected data': {
				return {
					...state,
					data: {
						...state.data,
						disaffectedData: action.payload.data,
					},
				};
			}
			case 'load affected user': {
				return {
					...state,
					data: {
						...state.data,
						name: action.payload.user,
					},
				};
			}
			case 'load book page': {
				return {
					...state,
					data: {
						...state.data,
						bookPage: action.payload.page,
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
			type: 'affected',
			name: '-',
			affectedData: {
				date: '-',
				shift: '-',
				day: '-',
				guardId: '-',
			},
			disaffectedData: {
				date: '-',
				shift: '-',
				day: '-',
				guardId: '-',
			},
			bookPage: '-',
			comment: '',
		},
		loading: false,
		dataIsValid: false,
	});

	const loadDate = useCallback(
		(data, section) => {
			section === 'affected'
				? dispatch({
						type: 'load affected data',
						payload: { data },
				  })
				: dispatch({
						type: 'load disaffected data',
						payload: { data },
				  });
		},
		[dispatch],
	);

	const loadItem = (value, type) => {
		type === 'cover'
			? dispatch({
					type: 'load affected user',
					payload: { user: value },
			  })
			: dispatch({
					type: 'load book page',
					payload: { page: value },
			  });
	};

	const sendNewChange = async () => {
		try {
			dispatch({ type: 'loading', payload: { status: true } });
			let consult = await httpRequestHandler(
				`${process.env.REACT_APP_API_URL}/api/item/new`,
				'POST',
				JSON.stringify(state.data),
				{
					authorization: `Bearer ${userContext.token}`,
					'Content-type': 'application/json',
				},
			);
			dispatch({ type: 'loading', payload: { status: false } });
			if (consult.error === 'Token expired') {
				userContext.logout(true);
				navigate('/');
				return;
			}
			if (consult.newAccessToken) {
				const newUserData = { ...userContext.userData, token: consult.newAccessToken };
				userContext.login(newUserData);
			}
			sendResult(consult.result);
		} catch (error) {
			toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
			console.log(error);
		}
	};

	const sendDataCallback = useCallback(() => {
		let formData = [
			state.data.name,
			Object.entries(state.data.affectedData).map((data) => data[1]),
			Object.entries(state.data.disaffectedData).map((data) => data[1]),
			state.data.bookPage,
		].flat(1);
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
		loadItem,
		loadDate,
		sendNewChange,
	};
};

export default useAffectedLoad;
