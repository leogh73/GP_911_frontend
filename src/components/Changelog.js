import React from 'react';
import { BsCalendarDate } from 'react-icons/bs';
import { BiTime, BiDetail } from 'react-icons/bi';
import { FaUser, FaUserAlt } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import './Changelog.css';

const generateRandomId = () => (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');

const Changelog = ({ log }) => {
	// console.log(log);
	return (
		<IconContext.Provider
			value={{
				size: 21,
				style: { color: 'slategray' },
			}}
		>
			<div className="log-container">
				{log.map((l, i) => (
					<div key={generateRandomId()}>
						<div className="event-box">
							<div className="date-time">
								<div className="data-container" style={{ width: '50%' }}>
									<div className="icon-container">
										<BsCalendarDate />
									</div>
									{l.date}
								</div>
								<div className="data-container" style={{ width: '50%' }}>
									<div className="icon-container">
										<BiTime />
									</div>

									{l.time}
								</div>
							</div>
							<div className="data-container">
								<div className="icon-container">
									<BiDetail />
								</div>
								{l.detail}
							</div>
							<div className="data-container">
								<div className="icon-container">
									<FaUserAlt />
								</div>
								{l.user}
							</div>
						</div>
						{i + 1 !== log.length && <div className="event-border"></div>}
					</div>
				))}
			</div>
		</IconContext.Provider>
	);
};

export default Changelog;
