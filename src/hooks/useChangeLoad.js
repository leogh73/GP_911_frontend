import { useCallback, useEffect, useContext, useReducer } from 'react';
import { toast } from 'react-toastify';
import CommentContext from '../context/CommentContext';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useChangeLoad = (resultData, startData) => {
	const userContext = useContext(UserContext);
	const commentContext = useContext(CommentContext);
	const { httpRequestHandler } = useHttpConnection();

	function reducer(state, action) {
		switch (action.type) {
			case 'load cover data': {
				return {
					...state,
					data: {
						...state.data,
						coverData: {
							...state.data.coverData,
							date: action.payload.data.date,
							day: action.payload.data.day,
							shift: action.payload.data.shift,
							guardId: action.payload.data.guardId,
						},
					},
				};
			}
			case 'load return data': {
				return {
					...state,
					data: {
						...state.data,
						returnData: {
							...state.data.returnData,
							date: action.payload.data.date,
							day: action.payload.data.day,
							shift: action.payload.data.shift,
							guardId: action.payload.data.guardId,
						},
					},
				};
			}
			case 'load cover user': {
				return {
					...state,
					data: {
						...state.data,
						coverData: {
							...state.data.coverData,
							name: action.payload.user,
						},
					},
				};
			}
			case 'load return user': {
				return {
					...state,
					data: {
						...state.data,
						returnData: {
							...state.data.returnData,
							name: action.payload.user,
						},
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
		type: 'change',
		data: {
			coverData: {
				name:
					startData?.coverData.name ??
					`${userContext.userData.lastName} ${userContext.userData.firstName}`,
				date: startData?.coverData.date ?? '-',
				shift: startData?.coverData.shift ?? '-',
				day: startData?.coverData.day ?? '-',
				guardId: startData?.coverData.guardId ?? '-',
			},
			returnData: {
				name: startData?.returnData.name ?? '-',
				date: startData?.returnData.date ?? '-',
				shift: startData?.returnData.shift ?? '-',
				day: startData?.returnData.day ?? '-',
				guardId: startData?.returnData.guardId ?? '-',
			},
		},
		loading: false,
		dataIsValid: false,
	});

	const loadDate = useCallback(
		(data, section) => {
			section === 'cover'
				? dispatch({
						type: 'load cover data',
						payload: { data },
				  })
				: dispatch({
						type: 'load return data',
						payload: { data },
				  });
		},
		[dispatch],
	);

	const loadUser = (user, section) => {
		section === 'cover'
			? dispatch({
					type: 'load cover user',
					payload: { user },
			  })
			: dispatch({
					type: 'load return user',
					payload: { user },
			  });
	};

	const sendDataCallback = useCallback(() => {
		let formData = [
			Object.entries(state.data.coverData).map((data) => data[1]),
			Object.entries(state.data.returnData).map((data) => data[1]),
		].flat(1);
		let isValid = true;
		formData.forEach((data) => {
			if (data === '-') isValid = false;
		});
		if (userContext.userData.section !== 'Monitoring' && commentContext.comment === '')
			isValid = false;
		if (
			(!!startData &&
				startData.coverData.name === state.data.coverData.name &&
				startData.returnData.name === state.data.returnData.name) ||
			(!!startData && state.data.coverData.name === state.data.returnData.name)
		) {
			isValid = false;
		}
		dispatch({ type: 'data is valid', payload: { status: isValid } });
	}, [state.data, startData, commentContext.comment, userContext.userData.section]);

	useEffect(() => {
		sendDataCallback();
	}, [state.data, sendDataCallback]);

	const sendChangeData = async () => {
		let headers = {
			authorization: `Bearer ${userContext.token}`,
			'Content-type': 'application/json',
		};
		let body = startData
			? {
					changeId: startData._id,
					coverName: {
						previous: startData.coverData.name,
						new:
							state.data.coverData.name !== startData.coverData.name
								? state.data.coverData.name
								: null,
					},
					returnName: {
						previous: startData.returnData.name,
						new:
							state.data.returnData.name !== startData.returnData.name
								? state.data.returnData.name
								: null,
					},
					comment: commentContext.comment,
			  }
			: {
					coverData: state.data.coverData,
					returnData: state.data.returnData,
					motive: commentContext.comment,
					type: 'change',
			  };
		try {
			dispatch({ type: 'loading', payload: { status: true } });
			let consult = await httpRequestHandler(
				`item/${startData ? 'edit' : 'new'}`,
				'POST',
				JSON.stringify(body),
				headers,
			);
			if (consult.error === 'Not authorized') {
				return userContext.logout(true);
			}
			if (consult.newAccessToken) {
				const newUserData = { ...userContext.userData, token: consult.newAccessToken };
				userContext.login(newUserData);
			}
			resultData(consult.result);
		} catch (error) {
			toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
			console.log(error);
		} finally {
			dispatch({ type: 'loading', payload: { status: false } });
		}
	};

	return {
		state,
		loadDate,
		loadUser,
		// dataIsValid,
		// loadingSendChange,
		sendChangeData,
	};
};

export default useChangeLoad;
