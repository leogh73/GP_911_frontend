import { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useSelectList = (name, type, sendSelectedItem) => {
	const [loadingUsers, setLoadingUsers] = useState(false);
	const context = useContext(UserContext);
	const { httpRequestHandler } = useHttpConnection();

	const initialState = {
		totalList: [],
		filterList: [],
		selectedItem: '-',
	};

	function reducer(state, action) {
		switch (action.type) {
			case 'load start data':
				return {
					...state,
					totalList: action.payload.items,
					filterList: action.payload.items,
				};
			case 'filter items':
				return {
					...state,
					filterList: action.payload.items,
				};
			case 'load item':
				return {
					...state,
					selectedItem: action.payload.item,
				};

			default:
				break;
		}
	}

	const [state, dispatch] = useReducer(reducer, initialState);

	const loadStartData = useCallback(async () => {
		let data = [];
		if (type === 'users') {
			try {
				setLoadingUsers(true);
				data = await httpRequestHandler(
					'http://localhost:5000/api/spreadsheet/users',
					'GET',
					null,
					{
						authorization: `Bearer ${context.token}`,
					},
				);
			} catch (error) {
				toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
				console.log(error);
			} finally {
				setLoadingUsers(false);
			}
		} else {
			for (let i = 1; i <= 200; i++) data.push(i.toString().padStart(3, 0));
		}
		dispatch({
			type: 'load start data',
			payload: { items: data },
		});
	}, [type, httpRequestHandler, context.token]);

	useEffect(() => {
		loadStartData();
	}, [loadStartData]);

	const inputHandler = (value) => {
		let result =
			type === 'users'
				? state.totalList.filter((user) => {
						let formattedUser = user.split(' ').map((w) => w.toLowerCase());
						let containsValue = false;
						formattedUser.forEach((name) => {
							if (name.startsWith(value.toLowerCase())) containsValue = true;
						});
						return containsValue ? user : null;
				  })
				: state.totalList.filter((item) => parseInt(item, 10).toString().startsWith(value));
		if (!result.length) result = ['No se encontraron resultados.'];
		dispatch({
			type: 'filter items',
			payload: { items: result },
		});
	};

	const loadItem = (item) => {
		dispatch({
			type: 'load item',
			payload: { item },
		});
		sendSelectedItem(item, name);
	};

	return {
		state,
		loadingUsers,
		loadItem,
		inputHandler,
	};
};

export default useSelectList;
