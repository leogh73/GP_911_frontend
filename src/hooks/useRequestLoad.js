import { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useRequestLoad = (sendResult) => {
	const [loadingSendChange, setLoadingSendChange] = useState(false);
	const [dataIsValid, setDataIsValid] = useState(false);
	const context = useContext(UserContext);
	const { httpRequestHandler } = useHttpConnection();

	const initialState = {
		name: `${context.lastName} ${context.firstName}`,
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
	};

	function reducer(state, action) {
		switch (action.type) {
			case 'load request data':
				return {
					...state,
					requestData: action.payload.data,
				};
			case 'load offer data': {
				return {
					...state,
					offerData: action.payload.data,
				};
			}
			default:
				break;
		}
	}

	const [state, dispatch] = useReducer(reducer, initialState);

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
			setLoadingSendChange(true);
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/changes/new',
				'POST',
				JSON.stringify(state),
				{
					authorization: `Bearer ${context.token}`,
					'Content-type': 'application/json',
				},
			);
			setLoadingSendChange(false);
			sendResult(consult);
		} catch (error) {
			toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
			console.log(error);
		}
	};

	const sendDataCallback = useCallback(() => {
		let formData = [
			Object.entries(state.requestData).map((data) => data[1]),
			Object.entries(state.offerData).map((data) => data[1]),
		].flat(1);
		let formCheck = formData
			.map((data) => (data !== '-' ? true : false))
			.filter((result) => !!result).length;
		let isValid = formCheck === 8 ? true : false;
		setDataIsValid(isValid);
	}, [state]);

	useEffect(() => {
		sendDataCallback();
	}, [state, sendDataCallback]);

	return {
		state,
		loadDate,
		dataIsValid,
		loadingSendChange,
		sendNewChange,
	};
};

export default useRequestLoad;
