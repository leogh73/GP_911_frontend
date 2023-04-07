import { useReducer, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useSelectDate = (sendDate, name) => {
	const userContext = useContext(UserContext);
	const navigate = useNavigate();
	const { httpRequestHandler } = useHttpConnection();

	function reducer(state, action) {
		switch (action.type) {
			case 'selected date': {
				return {
					...state,
					data: {
						...state.data,
						date: action.payload.date.formattedDate,
						day: action.payload.date.selectedDay,
					},
				};
			}
			case 'date guards': {
				return {
					...state,
					fetched: action.payload.data,
				};
			}
			case 'shift time': {
				return {
					...state,
					data: {
						...state.data,
						shift: action.payload.data,
					},
				};
			}
			case 'shift guard': {
				return {
					...state,
					data: {
						...state.data,
						guardId: action.payload.data.guardId,
					},
				};
			}
			default:
				break;
		}
	}

	const [state, dispatch] = useReducer(reducer, {
		fetched: [],
		data: {
			date: '-',
			shift: '-',
			day: '-',
			guardId: '-',
		},
	});

	const loadGuardId = (shift) => {
		if (state.fetched.length) {
			let index = state.fetched.findIndex((s) => s.shift === shift);
			dispatch({
				type: 'shift guard',
				payload: { data: state.fetched[index] },
			});
		}
	};

	const loadShift = (value) => {
		dispatch({
			type: 'shift time',
			payload: { data: value },
		});
		loadGuardId(value);
	};

	const dateHandler = (date) => {
		let selectedDate = new Date(date);
		let formattedDate = `${selectedDate.getDate().toString().padStart(2, 0)}/${(
			selectedDate.getMonth() + 1
		)
			.toString()
			.padStart(2, 0)}/${selectedDate.getFullYear()}`;
		let days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
		let selectedDay = days[selectedDate.getDay()];
		return { formattedDate, selectedDay };
	};

	const loadDateGuards = async (date) => {
		let dateData = dateHandler(date);
		dispatch({
			type: 'selected date',
			payload: { date: dateData },
		});

		try {
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/spreadsheet/day',
				'POST',
				JSON.stringify({ date: dateData.formattedDate }),
				{
					authorization: `Bearer ${userContext.token}`,
					'Content-type': 'application/json',
				},
			);

			if (consult.error === 'Token expired') {
				userContext.logout(true);
				navigate('/');
				return;
			}

			dispatch({
				type: 'date guards',
				payload: { data: consult },
			});

			if (state.data.shift !== '-') {
				let index = consult.findIndex((s) => s.shift === state.data.shift);
				dispatch({
					type: 'shift guard',
					payload: { data: consult[index] },
				});
			}
		} catch (error) {
			toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
			console.log(error);
		}
	};

	useEffect(() => {
		let formData = Object.entries(state.data)
			.map((data) => data[1])
			.flat(1);
		let formCheck = formData
			.map((data) => (data !== '-' ? true : false))
			.filter((result) => !!result).length;
		if (formCheck === 4) sendDate(state.data, name);
	}, [sendDate, state.data, name]);

	return {
		state,
		loadDateGuards,
		loadShift,
	};
};

export default useSelectDate;
