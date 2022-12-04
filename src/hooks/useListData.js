import { useContext, useReducer } from 'react';
import UserContext from '../context/UserContext';

const useListData = (itemsList) => {
	const context = useContext(UserContext);
	const fullName = `${context.lastName} ${context.firstName}`;
	const [listData, dispatch] = useReducer(reducer, {
		header: '#',
		showAll: true,
		fetched: itemsList,
		user: itemsList,
		filter: itemsList,
		search: '',
	});

	function sortList(listType, listData, sortBy) {
		const sortByPriority = () => listData.sort((a, b) => a.priorityId - b.priorityId);

		switch (listType) {
			case 'change': {
				switch (sortBy) {
					case '#':
						return sortByPriority();
					case 'A cubrir': {
						return listData.sort(
							(a, b) =>
								new Date(
									a.coverData.date.split('/')[2],
									a.coverData.date.split('/')[1],
									a.coverData.date.split('/')[0],
								) -
								new Date(
									b.coverData.date.split('/')[2],
									b.coverData.date.split('/')[1],
									b.coverData.date.split('/')[0],
								),
						);
					}
					case 'A devolver': {
						return listData.sort(
							(a, b) =>
								new Date(
									a.returnData.date.split('/')[2],
									a.returnData.date.split('/')[1],
									a.returnData.date.split('/')[0],
								) -
								new Date(
									b.returnData.date.split('/')[2],
									b.returnData.date.split('/')[1],
									b.returnData.date.split('/')[0],
								),
						);
					}
					case 'Quien cubre': {
						return listData.sort((a, b) => a.coverData.name.localeCompare(b.coverData.name));
					}
					case 'Quien devuelve': {
						return listData.sort((a, b) => a.returnData.name.localeCompare(b.returnData.name));
					}
					case 'Estado': {
						return listData.sort((a, b) => a.status.localeCompare(b.status));
					}
					default:
						return listData;
				}
			}
			case 'request':
				switch (sortBy) {
					case '#': {
						return sortByPriority();
					}
					case 'Personal': {
						return listData.sort((a, b) => a.name.localeCompare(b.name));
					}
					case 'Pedido': {
						return listData.sort(
							(a, b) =>
								new Date(
									a.requestData.date.split('/')[2],
									a.requestData.date.split('/')[1],
									a.requestData.date.split('/')[0],
								) -
								new Date(
									b.requestData.date.split('/')[2],
									b.requestData.date.split('/')[1],
									b.requestData.date.split('/')[0],
								),
						);
					}
					case 'Ofrecido': {
						return listData.sort(
							(a, b) =>
								new Date(
									a.offerData.date.split('/')[2],
									a.offerData.date.split('/')[1],
									a.offerData.date.split('/')[0],
								) -
								new Date(
									b.offerData.date.split('/')[2],
									b.offerData.date.split('/')[1],
									b.offerData.date.split('/')[0],
								),
						);
					}

					default:
						return listData;
				}
			case 'affected':
				switch (sortBy) {
					case '#': {
						return sortByPriority();
					}
					case 'Personal': {
						return listData.sort((a, b) => a.name.localeCompare(b.name));
					}
					case 'Afectado': {
						return listData.sort(
							(a, b) =>
								new Date(
									a.affectedData.date.split('/')[2],
									a.affectedData.date.split('/')[1],
									a.affectedData.date.split('/')[0],
								) -
								new Date(
									b.affectedData.date.split('/')[2],
									b.affectedData.date.split('/')[1],
									b.affectedData.date.split('/')[0],
								),
						);
					}
					case 'Desafectado': {
						return listData.sort(
							(a, b) =>
								new Date(
									a.disaffectedData.date.split('/')[2],
									a.disaffectedData.date.split('/')[1],
									a.disaffectedData.date.split('/')[0],
								) -
								new Date(
									b.disaffectedData.date.split('/')[2],
									b.disaffectedData.date.split('/')[1],
									b.disaffectedData.date.split('/')[0],
								),
						);
					}
					case 'Foja del Libro de Guardia': {
						return listData.sort((a, b) => a.bookPage - b.bookPage);
					}
					default:
						return listData;
				}
			default:
				return listData;
		}
	}

	function reducer(listData, action) {
		const filterUserItemsList = () => {
			switch (action.payload.list) {
				case 'change':
					return listData.fetched.filter(
						(i) => i.coverData.name === fullName || i.returnData.name === fullName,
					);
				case 'request':
					return listData.fetched.filter((i) => i.name === fullName);
				case 'affected':
					return listData.fetched.filter((i) => i.name === fullName);
				default:
					break;
			}
		};

		const itemRowData = (item, type) => {
			const changeItemFormat = (i) => [i.name.split(' '), i.date, i.day, i.shift, i.guardId];
			const requestAffectedItemFormat = (i) => [i.date, i.shift, i.day, i.guardId];
			switch (type) {
				case 'change': {
					return [
						changeItemFormat(item.coverData),
						changeItemFormat(item.returnData),
						item.status,
					].flat(2);
				}
				case 'request': {
					return [
						item.name.split(' '),
						requestAffectedItemFormat(item.offerData),
						requestAffectedItemFormat(item.requestData),
					].flat(1);
				}
				case 'affected': {
					return [
						item.name.split(' '),
						requestAffectedItemFormat(item.affectedData),
						requestAffectedItemFormat(item.disaffectedData),
						item.bookPage,
					].flat(1);
				}
				default:
					break;
			}
		};

		const inputFilter = (value, user) => {
			let searchList = user ? filterUserItemsList() : listData.fetched;
			return searchList.filter((item) => {
				let formattedRow = itemRowData(item, action.payload.list);
				let rowValues = formattedRow.map((w) => w.toLowerCase());
				let containsValue = false;
				rowValues.forEach((rowValue) => {
					if (rowValue.startsWith(value.toString().toLowerCase())) containsValue = true;
				});
				return containsValue ? item : null;
			});
		};

		switch (action.payload.type) {
			case 'change': {
				let accion;
				if (action.payload.action === 'cancel') accion = 'Cancelado';
				if (action.payload.action === 'approve') accion = 'Aprobado';
				if (action.payload.action === 'notapprove') accion = 'No aprobado';
				if (action.payload.action === 'void') accion = 'Anulado';
				let index = listData.user.findIndex((ch) => ch._id === action.payload.id);
				let newitemsList = { ...listData };
				newitemsList.user[index].status = accion;
				return { ...listData, user: newitemsList.user };
			}
			case 'header': {
				return listData.header === action.payload.value
					? { ...listData, user: listData.filter.reverse() }
					: {
							...listData,
							fetched: sortList(action.payload.list, listData.fetched, action.payload.value),
							user: listData.fetched,
							filter: sortList(action.payload.list, listData.filter, action.payload.value),
							header: action.payload.value,
					  };
			}
			case 'radioButton': {
				if (action.payload.value === 'Propios' && listData.showAll) {
					return {
						...listData,
						user: filterUserItemsList(listData, action),
						filter: listData.search.length
							? inputFilter(listData.search, true)
							: filterUserItemsList(),
						showAll: false,
					};
				}
				if (action.payload.value === 'Todos' && !listData.showAll) {
					return {
						...listData,
						user: listData.fetched,
						filter: listData.search.length
							? inputFilter(listData.search, false)
							: listData.fetched,
						showAll: true,
					};
				}
				return listData;
			}
			case 'searchInput': {
				return {
					...listData,
					filter: inputFilter(action.payload.value, !listData.showAll),
					search: action.payload.value,
				};
			}
			default:
				return listData;
		}
	}

	return { listData, dispatch };
};

export default useListData;
