import React from 'react';

const ScheduleWeekTable = ({ data }) => {
	const shiftStatusClass = (s) => {
		console.log(s);
		if (s.past) return 'past';
		if (s.status === 'work' && s.type == 'normal') return 'work';
		if (s.status === 'off' && s.type == 'normal') return '';
		if (s.status === 'work' && s.type === 'change') return 'work-change';
		if (s.status === 'off' && s.type === 'change') return 'off-change';
		if (s.status === 'work' && s.type === 'affected') return 'work-affected';
		if (s.status === 'off' && s.type === 'affected') return 'off-affected';
	};

	return (
		<table key={Math.random() * 1000}>
			<thead>
				<tr>
					{data.headersList.map((h) => (
						<th
							className="schedule"
							key={Math.random() * 1000}
							onClick={() => console.log('CLICK!')}
						>
							<div className="table-header">{h}</div>
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.shifts.map((shift) => (
					<tr key={Math.random() * 1000}>
						{shift.map((s, i) => (
							<td className={`row-data ${shiftStatusClass(s)}`} key={data.headersList[i]}>
								<div className="col-name">{data.headersList[i]}</div>
								<div className="data-col">{s.guardId}</div>
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default ScheduleWeekTable;
