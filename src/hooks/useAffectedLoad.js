import { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useAffectedLoad = (sendResult) => {
	const [loadingSendChange, setLoadingSendChange] = useState(false);
	const [dataIsValid, setDataIsValid] = useState(false);
	const userContext = useContext(UserContext);
	const { httpRequestHandler } = useHttpConnection();

	const initialState = {
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
		bookPage: '',
	};

	function reducer(state, action) {
		switch (action.type) {
			case 'load affected data':
				return {
					...state,
					affectedData: action.payload.data,
				};
			case 'load disaffected data': {
				return {
					...state,
					disaffectedData: action.payload.data,
				};
			}
			case 'load affected user': {
				return {
					...state,
					name: action.payload.user,
				};
			}
			case 'load book page': {
				return {
					...state,
					bookPage: action.payload.page,
				};
			}
			default:
				break;
		}
	}

	const [state, dispatch] = useReducer(reducer, initialState);

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
		type === 'users'
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
			setLoadingSendChange(true);
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/item/new',
				'POST',
				JSON.stringify(state),
				{
					authorization: `Bearer ${userContext.token}`,
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
			state.name,
			Object.entries(state.affectedData).map((data) => data[1]),
			Object.entries(state.disaffectedData).map((data) => data[1]),
			state.bookPage,
		].flat(1);
		let formCheck = formData
			.map((data) => (data !== '-' ? true : false))
			.filter((result) => !!result).length;
		let isValid = formCheck === 10 ? true : false;
		setDataIsValid(isValid);
	}, [state]);

	useEffect(() => {
		sendDataCallback();
	}, [state, sendDataCallback]);

	return {
		state,
		loadItem,
		loadDate,
		dataIsValid,
		loadingSendChange,
		sendNewChange,
	};
};

export default useAffectedLoad;
