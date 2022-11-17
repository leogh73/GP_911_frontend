import { useState, useEffect, useContext, useReducer } from 'react';
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
			name: context.fullName,
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
						date: action.payload.date,
						day: action.payload.day,
						shift: action.payload.shift,
						guardId: action.payload.guardId,
					},
				};
			case 'load return data':
				return {
					...state,
					returnData: {
						...state.returnData,
						date: action.payload.date,
						day: action.payload.day,
						shift: action.payload.shift,
						guardId: action.payload.guardId,
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

	const loadDate = (data, section) => {
		section === 'cover'
			? dispatch({
					type: 'load cover data',
					payload: { data },
			  })
			: dispatch({
					type: 'load return data',
					payload: { data },
			  });
	};

	const loadUser = (section, value) => {
		section === 'cover'
			? dispatch({
					type: 'load cover user',
					payload: { user: value },
			  })
			: dispatch({
					type: 'load return user',
					payload: { user: value },
			  });
	};

	useEffect(() => {
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
