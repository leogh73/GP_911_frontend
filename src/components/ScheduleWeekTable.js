import React, { useState } from 'react';
import Modal from './Modal';

const ScheduleWeekTable = ({ data }) => {
	const [showModal, setShowModal] = useState(false);
	const [shiftType, setShiftType] = useState('');
	const [detailData, setDetailData] = useState();

	const shiftStatusClass = (s) => {
		if (s.past) return 'past';
		if (s.status === 'work') return 'work';
		if (s.status === 'shift') return 'shift';
	};

	const modalTitle = (type) => {
		if (!type) setShiftType('Guardia habitual');
		if (type === 'change') setShiftType('Cambio de guardia');
		if (type === 'affected') setShiftType('Afectado');
	};

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
					{data.shifts.map((shift) => (
						<tr key={Math.random() * 1000}>
							{shift.map((s, i) => (
								<td
									className={`row-data ${shiftStatusClass(s)}`}
									key={data.headersList[i]}
									onClick={() => {
										if (s.status !== 'off') {
											modalTitle(s.type);
											setDetailData(s.detail);
											setShowModal(true);
										} else console.log('Click!');
									}}
								>
									<div className="col-name">{data.headersList[i]}</div>
									<div className="data-col">{s.guardId}</div>
								</td>
							))}
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

export default ScheduleWeekTable;
