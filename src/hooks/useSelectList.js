import { useEffect, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-toastify';
import SendNewContext from '../context/SendNewContext';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useSelectList = (name, type, sendSelectedItem, startData) => {
	const userContext = useContext(UserContext);
	const sendNewContext = useContext(SendNewContext);
	const { httpRequestHandler } = useHttpConnection();

	function reducer(state, action) {
		switch (action.type) {
			case 'load start data': {
				return {
					...state,
					totalList: action.payload.items,
					loading: false,
				};
			}
			case 'filter items': {
				return {
					...state,
					filterList: action.payload.items,
				};
			}
			case 'load item': {
				return {
					...state,
					selectedItem: action.payload.item,
				};
			}
			case 'loading': {
				return { ...state, loading: action.payload.status };
			}
			default:
				return state;
		}
	}

	const [state, dispatch] = useReducer(reducer, {
		totalList: [],
		filterList: [],
		selectedItem: startData ? startData.name : '-',
		loading: false,
	});

	const loadStartData = useCallback(async () => {
		let data = { items: [] };
		dispatch({ type: 'loading', payload: { status: true } });
		if (type === 'users') {
			try {
				let consult = await httpRequestHandler(
					'http://localhost:5000/api/spreadsheet/users',
					'GET',
					null,
					{
						authorization: `Bearer ${userContext.token}`,
					},
				);
				data.items = consult.usersList;
			} catch (error) {
				return toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
			}
		} else {
			for (let i = 1; i <= 200; i++) data.items.push(i.toString().padStart(3, 0));
		}
		if (data.newAccessToken) {
			const newUserData = { ...userContext.userData, token: data.newAccessToken };
			userContext.login(newUserData);
		}
		dispatch({
			type: 'load start data',
			payload: { items: data.items },
		});
	}, [httpRequestHandler, type, userContext]);

	useEffect(() => {
		loadStartData();
	}, [loadStartData]);

	const filterList = useCallback(() => {
		let userArray = [];
		userArray.push(sendNewContext.coverUser);
		userArray.push(sendNewContext.returnUser);
		let filteredData = state.totalList.filter((user) => !userArray.includes(user));
		dispatch({
			type: 'filter items',
			payload: { items: filteredData },
		});
	}, [sendNewContext.coverUser, sendNewContext.returnUser, state.totalList]);

	useEffect(() => {
		if (
			(state.totalList.length && sendNewContext.coverUser.length) ||
			(state.totalList.length && sendNewContext.returnUser.length)
		) {
			filterList();
		}
	}, [state.totalList, sendNewContext.coverUser, sendNewContext.returnUser, filterList]);

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
		loadItem,
		inputHandler,
	};
};

export default useSelectList;
