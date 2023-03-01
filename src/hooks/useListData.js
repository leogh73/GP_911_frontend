import { useReducer, useContext } from 'react';
import UserContext from '../context/UserContext';

const useListData = (dataList, rowType) => {
	const userContext = useContext(UserContext);
	const fullName = `${userContext.userData.lastName} ${userContext.userData.firstName}`;

	const [listData, dispatch] = useReducer(reducer, {
		header: '#',
		showUser: false,
		showSuperior: false,
		fetched: dataList,
		user: rowType === 'user' ? dataList.filter((user) => !user.superior) : dataList,
		filter: rowType === 'user' ? dataList.filter((user) => !user.superior) : dataList,
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
			case 'user':
				switch (sortBy) {
					case 'Apellido': {
						return listData.sort((a, b) => a.lastName.localeCompare(b.lastName));
					}
					case 'Nombre': {
						return listData.sort((a, b) => a.firstName.localeCompare(b.firstName));
					}
					case 'NI': {
						return listData.sort((a, b) => a.ni.toString().localeCompare(b.ni.toString()));
					}
					case 'Jerarquía': {
						return listData.sort((a, b) => a.hierarchy.localeCompare(b.hierarchy));
					}
					case 'Guardia': {
						return listData.sort((a, b) => {
							a.guardId = a.guardId ?? '-';
							b.guardId = b.guardId ?? '-';
							return a.guardId.localeCompare(b.guardId);
						});
					}
					case 'Usuario': {
						return listData.sort((a, b) => a.username.localeCompare(b.username));
					}
					case 'Correo electrónico': {
						return listData.sort((a, b) => a.email.localeCompare(b.email));
					}
				}
			default:
				return listData;
		}
	}

	function reducer(listData, action) {
		const filterItemList = () => {
			if (action.payload.list === 'change')
				return listData.fetched.filter(
					(i) => i.coverData.name === fullName || i.returnData.name === fullName,
				);
			if (action.payload.list === 'request' || action.payload.list === 'affected')
				return listData.fetched.filter((i) => i.name === fullName);
			if (action.payload.list === 'user') return listData.fetched.filter((i) => i.superior);
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
				case 'user': {
					return [
						item.lastName,
						item.firstName,
						item.ni.toString(),
						item.hierarchy,
						item.guardId ?? '-',
						item.username,
						item.email,
					];
				}
				default:
					break;
			}
		};

		const inputFilter = (value, userOrSuperior) => {
			let searchList;
			if (rowType === 'user') {
				searchList = userOrSuperior
					? filterItemList()
					: listData.fetched.filter((user) => !user.superior);
			} else {
				searchList = userOrSuperior ? filterItemList() : listData.fetched;
			}
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

		const modifyList = (id, newStatus, removeItem, changelog) => {
			let newItemsList = { ...listData };
			let index = newItemsList.fetched.findIndex((i) => i._id === id);
			if (removeItem) {
				newItemsList.fetched.splice(index, 1);
			} else {
				newItemsList.fetched[index].status = newStatus;
				newItemsList.fetched[index].changelog.push(changelog);
			}
			return newItemsList;
		};

		switch (action.payload.type) {
			case 'modify': {
				let newList = modifyList(
					action.payload.id,
					action.payload.status,
					false,
					action.payload.changelog,
				);
				return { ...newList };
			}
			case 'delete': {
				let newList = modifyList(action.payload.id, null, true, null);
				return { ...newList };
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
				if (action.payload.list === 'user') {
					if (action.payload.value === 'Superiores' && !listData.showSuperior) {
						let filteredData = listData.fetched.filter((user) => user.superior);
						return {
							...listData,
							user: filteredData,
							filter: listData.search.length ? inputFilter(listData.search, true) : filteredData,
							showSuperior: true,
						};
					}
					if (action.payload.value === 'Subalternos' && listData.showSuperior) {
						let filteredData = listData.fetched.filter((user) => !user.superior);
						return {
							...listData,
							user: filteredData,
							filter: listData.search.length ? inputFilter(listData.search, false) : filteredData,
							showSuperior: false,
						};
					}
				}
				if (action.payload.value === 'Propios' && !listData.showUser) {
					return {
						...listData,
						user: filterItemList(),
						filter: listData.search.length ? inputFilter(listData.search, true) : filterItemList(),
						showUser: true,
					};
				}
				if (action.payload.value === 'Todos' && listData.showUser) {
					return {
						...listData,
						user: listData.fetched,
						filter: listData.search.length
							? inputFilter(listData.search, false)
							: listData.fetched,
						showUser: false,
					};
				}
				return listData;
			}
			case 'searchInput': {
				return {
					...listData,
					filter:
						action.payload.list === 'user'
							? inputFilter(action.payload.value, listData.showSuperior)
							: inputFilter(action.payload.value, listData.showUser),
					search: action.payload.value,
				};
			}
			default:
				return { ...listData };
		}
	}

	return { listData, dispatch };
};

export default useListData;
