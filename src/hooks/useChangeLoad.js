import { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useChangeLoad = (resultData) => {
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [loadingSendChange, setLoadingSendChange] = useState(false);
	const [dataIsValid, setDataIsValid] = useState(false);
	const context = useContext(UserContext);
	const { httpRequestHandler } = useHttpConnection();

	const initialState = {
		fetchedData: {
			totalUsers: [],
			coverDay: [],
			returnDay: [],
		},
		filteredData: {
			coverUsers: [],
			returnUsers: [],
		},
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
			case 'load users':
				return {
					...state,
					fetchedData: {
						...state.fetchedData,
						totalUsers: action.payload.users,
					},
				};
			case 'filter cover users':
				return {
					...state,
					filteredData: {
						...state.filteredData,
						coverUsers: action.payload.users,
					},
				};
			case 'filter return users':
				return {
					...state,
					filteredData: {
						...state.filteredData,
						returnUsers: action.payload.users,
					},
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
			case 'selected cover date':
				return {
					...state,
					coverData: {
						...state.coverData,
						date: action.payload.date.formattedDate,
						day: action.payload.date.selectedDay,
					},
				};
			case 'selected return date':
				return {
					...state,
					returnData: {
						...state.returnData,
						date: action.payload.date.formattedDate,
						day: action.payload.date.selectedDay,
					},
				};
			case 'cover date guards':
				return {
					...state,
					fetchedData: {
						...state.fetchedData,
						coverDay: action.payload.data,
					},
				};
			case 'return date guards':
				return {
					...state,
					fetchedData: {
						...state.fetchedData,
						returnDay: action.payload.data,
					},
				};
			case 'cover shift guard':
				return {
					...state,
					coverData: {
						...state.coverData,
						guardId: action.payload.data.guardId,
					},
				};
			case 'return shift guard':
				return {
					...state,
					returnData: {
						...state.returnData,
						guardId: action.payload.data.guardId,
					},
				};
			case 'cover shift time':
				return {
					...state,
					coverData: {
						...state.coverData,
						shift: action.payload.data,
					},
				};
			case 'return shift time':
				return {
					...state,
					returnData: {
						...state.returnData,
						shift: action.payload.data,
					},
				};

			case 'change valid status':
				return { ...state, dataIsValid: action.payload.isValid };
			default:
				return state;
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
			let index = consult.findIndex((user) => user === `${context.fullName}`);
			consult.splice(index, 1);
			dispatch({
				type: 'filter cover users',
				payload: { users: consult },
			});
			dispatch({
				type: 'filter return users',
				payload: { users: consult },
			});
		} catch (error) {
			toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
			console.log(error);
		} finally {
			setLoadingUsers(false);
		}
	}, [httpRequestHandler, context.fullName, context.token]);

	const loadGuardId = (section, shift) => {
		let dayGuards = section === 'cover' ? state.fetchedData.coverDay : state.fetchedData.returnDay;
		if (dayGuards.length) {
			let index = dayGuards.findIndex((s) => s.shift === shift);
			section === 'cover'
				? dispatch({
						type: 'cover shift guard',
						payload: { data: dayGuards[index] },
				  })
				: dispatch({
						type: 'return shift guard',
						payload: { data: dayGuards[index] },
				  });
		}
	};

	const loadShift = (section, value) => {
		section === 'cover'
			? dispatch({
					type: 'cover shift time',
					payload: { data: value },
			  })
			: dispatch({
					type: 'return shift time',
					payload: { data: value },
			  });
		loadGuardId(section, value);
	};

	const dateHandler = (date) => {
		let selectedDate = new Date(date);
		let formattedDate = `${selectedDate.getDate()}/${(selectedDate.getMonth() + 1)
			.toString()
			.padStart(2, 0)}/${selectedDate.getFullYear()}`;
		let days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
		let selectedDay = days[selectedDate.getDay()];
		return { formattedDate, selectedDay };
	};

	const loadDateGuards = async (date, section) => {
		let dateData = dateHandler(date);
		section === 'cover'
			? dispatch({
					type: 'selected cover date',
					payload: { date: dateData },
			  })
			: dispatch({
					type: 'selected return date',
					payload: { date: dateData },
			  });
		try {
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/spreadsheet/day',
				'POST',
				JSON.stringify({ date: dateData.formattedDate }),
				{
					authorization: `Bearer ${context.token}`,
					'Content-type': 'application/json',
				},
			);

			if (section === 'cover') {
				dispatch({
					type: 'cover date guards',
					payload: { data: consult },
				});
			} else {
				dispatch({
					type: 'return date guards',
					payload: { data: consult },
				});
			}
			let selectedShift = section === 'cover' ? state.coverData.shift : state.returnData.shift;
			if (selectedShift !== '-') {
				let index = consult.findIndex((s) => s.shift === selectedShift);
				section === 'cover'
					? dispatch({
							type: 'cover shift guard',
							payload: { data: consult[index] },
					  })
					: dispatch({
							type: 'return shift guard',
							payload: { data: consult[index] },
					  });
			}
		} catch (error) {
			toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
			console.log(error);
		}
	};

	useEffect(() => {
		async function loadData() {
			await loadUsers();
		}
		loadData();
	}, [loadUsers]);

	const filterUsers = (section, value) => {
		let result = state.fetchedData.totalUsers.filter((user) => {
			let formattedUser = user.split(' ').map((w) => w.toLowerCase());
			let containsValue = false;
			formattedUser.forEach((name) => {
				if (name.startsWith(value.toLowerCase())) containsValue = true;
			});
			return containsValue ? user : null;
		});
		if (!result.length) result = ['No se encontraron usuarios.'];
		section === 'cover'
			? dispatch({
					type: 'filter cover users',
					payload: { users: result },
			  })
			: dispatch({
					type: 'filter return users',
					payload: { users: result },
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
	}, [state.coverData, state.returnData]);

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
		loadingUsers,
		loadDateGuards,
		loadShift,
		loadUser,
		filterUsers,
		dataIsValid,
		loadingSendChange,
		sendNewChange,
	};
};

export default useChangeLoad;
