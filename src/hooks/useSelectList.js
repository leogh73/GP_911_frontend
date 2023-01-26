import { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-toastify';
import SendNewContext from '../context/SendNewContext';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useSelectList = (name, type, sendSelectedItem, startData) => {
	const [loadingUsers, setLoadingUsers] = useState(false);
	const userContext = useContext(UserContext);
	const sendNewContext = useContext(SendNewContext);
	const { httpRequestHandler } = useHttpConnection();

	const initialState = {
		totalList: [],
		filterList: [],
		selectedItem: startData ? startData.name : '-',
	};

	function reducer(state, action) {
		switch (action.type) {
			case 'load start data':
				return {
					...state,
					totalList: action.payload.items,
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
						authorization: `Bearer ${userContext.token}`,
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
		// let filteredData = [...data];
		// !!startData
		// 	? filteredData.splice(
		// 			data.findIndex((user) => user === startData.name),
		// 			1,
		// 	  )
		// 	: filteredData.splice(
		// 			data.findIndex((user) => user === `${userContext.lastName} ${userContext.firstName}`),
		// 			1,
		// 	  );
		// let userArray = [];
		// userArray.push(sendNewContext.returnUser);
		// userArray.push(sendNewContext.coverUser);
		// let newFilteredData = filteredData.filter((user) => !userArray.includes(user));
		dispatch({
			type: 'load start data',
			payload: { items: data },
		});
	}, [httpRequestHandler, type, userContext.token]);

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
		)
			console.log('LIST EFFECT!!');
		filterList();
	}, [
		state.totalList.length,
		sendNewContext.coverUser.length,
		sendNewContext.returnUser.length,
		filterList,
	]);

	const inputHandler = (value) => {
		let result =
			type === 'users'
				? state.filterList.filter((user) => {
						let formattedUser = user.split(' ').map((w) => w.toLowerCase());
						let containsValue = false;
						formattedUser.forEach((name) => {
							if (name.startsWith(value.toLowerCase())) containsValue = true;
						});
						return containsValue ? user : null;
				  })
				: state.filterList.filter((item) => parseInt(item, 10).toString().startsWith(value));
		if (!result.length) result = ['No se encontraron resultados.'];
		dispatch({
			type: 'filter items',
			payload: { items: result },
		});
	};

	const loadItem = (item) => {
		// let filteredList = [...state.totalList];
		// filteredList.splice(
		// 	state.totalList.findIndex((user) => user === item),
		// 	1,
		// );
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
