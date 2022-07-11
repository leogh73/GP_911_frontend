import { useState, useEffect, useRef, useContext, useCallback, useReducer } from 'react';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useChangeLoad = (resultData) => {
	const [selectedDate, setSelectedDate] = useState();
	const [loadingReturn, setLoadingReturn] = useState();
	// const [cargandoCubrir, setCargandoCubrir] = useState();
	const [loadingSendChange, setLoadingSendChange] = useState(false);
	const [dataIsValid, setDataIsValid] = useState(false);

	const firstLoad = useRef(true);

	const context = useContext(UserContext);

	const { httpRequestHandler } = useHttpConnection();

	const today = new Date(Date.now());
	const loadDay = () => {
		let dayToday = today.getDay();
		let days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
		return days[dayToday];
	};

	const initialState = {
		consultReturn: {
			date: '',
			day: '-',
			dayTotal: '',
			schedule: [],
			selection: {
				guardId: '-',
				shift: '-',
				staff: [],
			},
		},
		consultCover: context.userGuards,
		changeData: {
			startDate: today.toLocaleString('es-AR').split(' ')[0],
			startDay: loadDay(),
			return: {
				date: '-',
				day: '-',
				shift: '-',
				guardId: '-',
				employeeName: context.fullName,
			},
			cover: {
				date: '-',
				day: '-',
				shift: '-',
				guardId: context.guardId,
				employeeName: '-',
				resume: '-',
			},
		},
	};

	function reducer(state, action) {
		switch (action.type) {
			case 'consult date':
				return {
					...state,
					consultReturn: {
						...state.consultReturn,
						date: action.payload.date,
						selection: {
							guardId: '-',
							shift: '-',
							staff: [],
						},
					},
					changeData: {
						...state.changeData,
						return: { ...state.changeData.return, date: action.payload.date },
						cover: { ...state.changeData.cover, staff: '-' },
					},
				};
			case 'load return guards':
				return {
					...state,
					consultReturn: {
						...state.consultReturn,
						dayTotal: action.payload.guards[1],
						schedule: ['6 a 14 hs.', '14 a 22 hs.', '22 a 6 hs.'],
					},
					changeData: {
						...state.changeData,
						return: {
							...state.changeData.return,
							day: action.payload.guards[0][0].day,
							shift: '-',
							guardId: '-',
							staff: context.fullName,
						},
					},
				};
			case 'filter guard shift':
				console.log(action.payload.guard);
				return {
					...state,
					consultReturn: {
						...state.consultReturn,
						selection: {
							guardId: action.payload.guardId.guardId,
							shift: action.payload.guardId.shift,
							staff: action.payload.guardId.staff,
						},
					},
					changeData: {
						...state.changeData,
						return: {
							...state.changeData.return,
							shift: action.payload.guardId.shift,
							guardId: action.payload.guardId.guardId,
						},
						cover: {
							...state.changeData.cover,
							staff: '-',
						},
					},
				};
			case 'load cover employee':
				return {
					...state,
					changeData: {
						...state.changeData,
						cover: {
							...state.changeData.cover,
							employeeName: action.payload.employeeName,
						},
					},
				};
			case 'load cover guard data':
				return {
					...state,
					changeData: {
						...state.changeData,
						cover: {
							...state.changeData.cover,
							date: action.payload.guardId.date,
							day: action.payload.guardId.day,
							shift: action.payload.guardId.shift,
							resume: action.payload.guardId.resume,
						},
					},
				};
			case 'clean cover guard':
				return {
					...state,
					changeData: {
						...state.changeData,
						cover: {
							...state.changeData.cover,
							date: '-',
							day: '-',
							shift: '-',
							resume: '-',
						},
					},
				};
			case 'clean return shift':
				return {
					...state,
					consultReturn: {
						...state.consultReturn,
						selection: {
							guardId: '-',
							shift: '-',
							staff: [],
						},
					},
					changeData: {
						...state.changeData,
						cover: {
							...state.changeData.cover,
							employeeName: '-',
						},
						return: {
							...state.changeData.return,
							shift: '-',
							guardId: '-',
						},
					},
				};
			case 'clean cover staff':
				return {
					...state,
					changeData: {
						...state.changeData,
						cover: {
							...state.changeData.cover,
							employeeName: '-',
						},
					},
				};
			case 'change valid status':
				return { ...state, dataIsValid: action.payload.isValid };
			default:
				return state;
		}
	}

	// const cargarGuardiasCubrir = useCallback(async () => {
	// 	try {
	// 		setCargandoCubrir(true);
	// 		let consult = await httpRequestHandler(
	// 			'http://localhost:5000/api/guardias/mespropias',
	// 			'POST',
	// 			{},
	// 			{
	// 				authorization: `Bearer ${context.token}`,
	// 			},
	// 		);
	// 		dispatch({
	// 			type: 'cargar guardias cover',
	// 			payload: { guardias: consult },
	// 		});
	// 		setCargandoCubrir(false);
	// 	} catch (error) {
	// 		toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
	// 		console.log(error);
	// 	}
	// }, [httpRequestHandler, context]);

	const loadDateGuards = useCallback(
		async (date) => {
			setSelectedDate(date);
			let consultDate = new Date(date).toLocaleString().split(' ')[0];
			dispatch({
				type: 'consult date',
				payload: { date: consultDate },
			});
			try {
				setLoadingReturn(true);
				let consult = await httpRequestHandler(
					'http://localhost:5000/api/guards/day',
					'POST',
					JSON.stringify({ date: consultDate }),
					{
						authorization: `Bearer ${context.token}`,
						'Content-type': 'application/json',
					},
				);
				dispatch({
					type: 'load return guards',
					payload: { guards: consult },
				});
				setLoadingReturn(false);
			} catch (error) {
				toast('Ocurrió un error. Reintente más tarde.', { type: 'error' });
				console.log(error);
			}
		},
		[context.token, httpRequestHandler],
	);

	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		async function loadData() {
			if (firstLoad.current) {
				// 	await cargarGuardiasCubrir();
				firstLoad.current = false;
				return;
			}
		}
		loadData();
	}, []);

	useEffect(() => {
		function verifyChangeData() {
			if (firstLoad.current) {
				firstLoad.current = false;
				return;
			}
			let datos = [
				state.changeData.return.shift,
				state.changeData.cover.date,
				state.changeData.cover.employeeName,
			];

			let isValid = true;
			for (let i = 0; i < datos.length; i++) {
				if (datos[i] === '-') isValid = false;
			}
			setDataIsValid(isValid);
		}
		verifyChangeData();
	}, [
		state.changeData.return.shift,
		state.changeData.cover.date,
		state.changeData.cover.employeeName,
	]);

	const filterUserGuards = (shift) => {
		if (shift === 'Seleccionar') dispatch({ type: 'clean return shift' });
		if (shift !== 'Seleccionar') {
			let shiftIndex = state.consultReturn.dayTotal.findIndex((guard) => guard.shift === shift);
			dispatch({
				type: 'filter guard shift',
				payload: { guardId: state.consultReturn.dayTotal[shiftIndex] },
			});
		}
	};

	const loadCoverStaff = (employeeName) => {
		if (employeeName === 'Seleccionar') dispatch({ type: 'clean cover staff' });
		if (employeeName !== 'Seleccionar') {
			dispatch({
				type: 'load cover employee',
				payload: { employeeName: employeeName },
			});
		}
	};

	const loadCoverGuardData = (guardResume) => {
		if (guardResume === 'Seleccionar')
			dispatch({
				type: 'clean cover guard',
			});
		if (guardResume !== 'Seleccionar') {
			let guardIndex = state.consultCover.guardsList.findIndex(
				(guard) => guard.resume === guardResume,
			);
			dispatch({
				type: 'load cover guard data',
				payload: { guardId: state.consultCover.guardsList[guardIndex] },
			});
		}
	};

	const sendNewChange = async () => {
		try {
			setLoadingSendChange(true);
			let consult = await httpRequestHandler(
				'http://localhost:5000/api/changes/new',
				'POST',
				JSON.stringify({
					startDate: state.changeData.startDate,
					startDay: state.changeData.startDay,
					returnName: state.changeData.return.employeeName,
					coverName: state.changeData.cover.employeeName,
					returnResult: {
						date: state.changeData.return.date,
						day: state.changeData.return.day,
						shift: state.changeData.return.shift,
						guardId: state.changeData.return.guardId,
					},
					coverResult: {
						date: state.changeData.cover.date,
						day: state.changeData.cover.day,
						shift: state.changeData.cover.shift,
						guardId: state.changeData.cover.guardId,
					},
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
		selectedDate,
		loadingReturn,
		loadingSendChange,
		loadDateGuards,
		filterUserGuards,
		loadCoverStaff,
		loadCoverGuardData,
		dataIsValid,
		sendNewChange,
	};
};

export default useChangeLoad;
