import { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useSelectUser = (resultData, name) => {
	const [loadingUsers, setLoadingUsers] = useState(false);
	const context = useContext(UserContext);
	const { httpRequestHandler } = useHttpConnection();

	const initialState = {
		totalUsers: [],
		filterUsers: [],
		selectedUser: '-',
	};

	function reducer(state, action) {
		switch (action.type) {
			case 'load users':
				return {
					...state,
					totalUsers: action.payload.users,
					filterUsers: action.payload.users,
				};
			case 'load user':
				return {
					...state,
					selectedUser: action.payload.user,
				};
			case 'filter users':
				return {
					...state,
					filterUsers: action.payload.users,
				};
			case 'load cover user':
				return {
					...state,
					coverData: {
						...state.coverData,
						name: action.payload.user,
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

			case 'change valid status':
				return { ...state, dataIsValid: action.payload.isValid };
			default:
				break;
		}
	}

	const [state, dispatch] = useReducer(reducer, initialState);

	const loadUsers = useCallback(async () => {
		try {
			setLoadingUsers(true);
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/spreadsheet/users',
				'GET',
				null,
				{
					authorization: `Bearer ${context.token}`,
				},
			);
			dispatch({
				type: 'load users',
				payload: { users: consult },
			});
		} catch (error) {
			toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
			console.log(error);
		} finally {
			setLoadingUsers(false);
		}
	}, [httpRequestHandler, context.token]);

	useEffect(() => {
		async function loadData() {
			await loadUsers();
		}
		loadData();
	}, [loadUsers]);

	const inputHandler = (value) => {
		let result = state.totalUsers.filter((user) => {
			let formattedUser = user.split(' ').map((w) => w.toLowerCase());
			let containsValue = false;
			formattedUser.forEach((name) => {
				if (name.startsWith(value.toLowerCase())) containsValue = true;
			});
			return containsValue ? user : null;
		});
		if (!result.length) result = ['No se encontraron usuarios.'];
		dispatch({
			type: 'filter users',
			payload: { users: result },
		});
	};

	const loadUser = (value) => {
		dispatch({
			type: 'load user',
			payload: { user: value },
		});
		resultData(name, value);
	};

	return {
		state,
		loadingUsers,
		loadUser,
		inputHandler,
	};
};

export default useSelectUser;
