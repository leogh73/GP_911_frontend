import { useState, useCallback, useEffect, useContext, useReducer } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useChangeLoad = (resultData) => {
	const [loadingSendChange, setLoadingSendChange] = useState(false);
	const [dataIsValid, setDataIsValid] = useState(false);
	const context = useContext(UserContext);
	const { httpRequestHandler } = useHttpConnection();

	const initialState = {
		coverData: {
			name: `${context.lastName} ${context.firstName} `,
			date: '-',
			shift: '-',
			day: '-',
			guardId: '-',
		},
		returnData: {
			name: '-',
			date: '-',
			shift: '-',
			day: '-',
			guardId: '-',
		},
	};

	function reducer(state, action) {
		switch (action.type) {
			case 'load cover data':
				return {
					...state,
					coverData: {
						...state.coverData,
						date: action.payload.data.date,
						day: action.payload.data.day,
						shift: action.payload.data.shift,
						guardId: action.payload.data.guardId,
					},
				};
			case 'load return data':
				return {
					...state,
					returnData: {
						...state.returnData,
						date: action.payload.data.date,
						day: action.payload.data.day,
						shift: action.payload.data.shift,
						guardId: action.payload.data.guardId,
					},
				};
			case 'load return user':
				return {
					...state,
					returnData: {
						...state.returnData,
						name: action.payload.user,
					},
				};
			default:
				break;
		}
	}

	const [state, dispatch] = useReducer(reducer, initialState);

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
			Object.entries(state.coverData).map((data) => data[1]),
			Object.entries(state.returnData).map((data) => data[1]),
		].flat(1);
		let formCheck = formData
			.map((data) => (data !== '-' ? true : false))
			.filter((result) => !!result).length;
		let isValid = formCheck === 10 ? true : false;
		setDataIsValid(isValid);
	}, [state]);

	useEffect(() => {
		sendDataCallback();
	}, [state]);

	const sendNewChange = async () => {
		try {
			setLoadingSendChange(true);
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/changes/new',
				'POST',
				JSON.stringify({
					coverData: state.coverData,
					returnData: state.returnData,
				}),
				{
					authorization: `Bearer ${context.token}`,
					'Content-type': 'application/json',
				},
			);
			setLoadingSendChange(false);
			resultData(consult);
		} catch (error) {
			toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
			console.log(error);
		}
	};

	return {
		state,
		loadDate,
		loadUser,
		dataIsValid,
		loadingSendChange,
		sendNewChange,
	};
};

export default useChangeLoad;
