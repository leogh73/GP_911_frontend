import React, { useState, useContext } from 'react';
import Modal from './Modal';
// import './ScheduleTable.css';
import UserContext from '../context/UserContext';

const ScheduleTable = ({ splitted, data }) => {
	const [showModal, setShowModal] = useState(false);
	const [shiftType, setShiftType] = useState('');
	const [detailData, setDetailData] = useState();
	const userContext = useContext(UserContext);

	const shiftStatusClass = (s) => {
		if (s.status === 'shift') return 'shift';
		if (s.past) return 'past';
		if (s.status === 'work' && !userContext.userData.superior) return 'work-user';
		if (!s.past && userContext.userData.superior) return 'table-superior';
		return '';
	};

	const shiftClickHandler = (s) => {
		if (!s.type) setShiftType('Guardia habitual');
		if (s.type === 'change') setShiftType('Cambio de guardia');
		if (s.type === 'affected') setShiftType('Afectado');
		setDetailData(s.detail);
		setShowModal(true);
	};

	const generateRow = (dataList) => (
		<>
			{dataList.map((item) => (
				<td
					key={Math.random() * 1000}
					className={`row-data ${shiftStatusClass(item.data)}`}
					onClick={() => (item.data.status !== 'shift' ? shiftClickHandler(item.data) : null)}
				>
					<div className="col-name">{item.columnName}</div>
					<div className="data-col">{item.rowData}</div>
				</td>
			))}
		</>
	);

	return (
		<>
			<table>
				<thead>
					<tr>
						{data.headersList.map((h) => (
							<th className="schedule" key={Math.random() * 1000}>
								<div className="table-header">{h}</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{splitted
						? data.shifts.map((shift) => (
								<tr key={Math.random() * 1000}>
									{shift.map((s, i) => (
										<td
											className={`row-data ${shiftStatusClass(s)}`}
											key={data.headersList[i]}
											onClick={() => shiftClickHandler(s)}
										>
											<div className="col-name">{data.headersList[i]}</div>
											<div className="data-col">{s.guardId}</div>
										</td>
									))}
								</tr>
						  ))
						: data.shifts.map((s, i) => (
								<tr key={Math.random() * 1000}>
									{generateRow(
										[
											{
												columnName: data.headersList[0],
												rowData: s.day,
												data: { status: 'shift' },
											},
											{
												columnName: data.headersList[1],
												rowData: s.shifts[0].guardId,
												data: s.shifts[0],
											},
											{
												columnName: data.headersList[2],
												rowData: s.shifts[1].guardId,
												data: s.shifts[1],
											},
											{
												columnName: data.headersList[3],
												rowData: s.shifts[2].guardId,
												data: s.shifts[2],
											},
										],
										s,
									)}
								</tr>
						  ))}
				</tbody>
			</table>
			{showModal && (
				<Modal
					id={Math.random() * 10000}
					title={shiftType}
					body={
						detailData ? detailData.toString() : 'No se han hecho cambios para el día seleccionado'
					}
					closeText={'Cerrar'}
					closeFunction={() => setShowModal(false)}
				/>
			)}
		</>
	);
};

export default ScheduleTable;
