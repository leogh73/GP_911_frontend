import React from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { BsCalendarDate } from 'react-icons/bs';
import { BiCommentDetail, BiTime } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import './Changelog.css';

const generateRandomId = () => (Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '');

const Changelog = ({ log }) => {
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
									<div className="changelog-text">{l.date}</div>
								</div>
								<div className="data-container" style={{ width: '50%' }}>
									<div className="icon-container">
										<BiTime size={22} />
									</div>
									<div className="changelog-text">{l.time} </div>
								</div>
							</div>
							<div className="data-container">
								<div className="icon-container">
									<AiFillEdit />
								</div>
								<div className="detail-list">
									{l.details.map((d) => (
										<div className="detail" key={generateRandomId()}>
											<div className="changelog-text">{d.toString()} </div>
										</div>
									))}
								</div>
							</div>
							{l.comment && (
								<div className="data-container">
									<div className="icon-container">
										<BiCommentDetail />
									</div>
									<div className="changelog-text">{l.comment}</div>
								</div>
							)}
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
