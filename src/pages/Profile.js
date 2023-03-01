import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Form from '../components/Form';
import { FaUserCheck, FaUserCircle, FaUserPlus, FaUserTimes } from 'react-icons/fa';

import { ToastContainer } from 'react-toastify';
import { FaUser, FaExchangeAlt, FaEdit } from 'react-icons/fa';
import { BiCommentDetail } from 'react-icons/bi';

import 'react-calendar/dist/Calendar.css';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Title from '../components/Title';

import UserContext from '../context/UserContext';
import { CgProfile } from 'react-icons/cg';

const Profile = ({ startData }) => {
	const [success, setSuccess] = useState();
	const [error, setError] = useState();
	const userContext = useContext(UserContext);

	const modificationResult = (result) => {
		result.userId ? setSuccess(true) : setError(true);
	};

	const goBack = () => {
		setError(false);
		setSuccess(false);
	};

	const { firstName, lastName, ni, hierarchy, section, guardId, email, superior, admin } =
		userContext.userData;

	const changeSection = (key, content, icon, title, data) => (
		<div key={key} className="user-section">
			<div className="user-section-profile">
				{content ? (
					content
				) : (
					<>
						<div className="section-icon">{icon}</div>
						<div className="section-text">
							<div className="section-title">{title}</div>
							{data}
						</div>
					</>
				)}
			</div>
		</div>
	);

	return (
		<div className="new-change">
			<Title icon={<CgProfile />} text={'Perfil'} />
			<div className="new-change-data">
				<div className="user-change-section">
					{changeSection('01', null, <FaUser />, firstName, 'Nombre')}
				</div>
				<div className="user-change-section">
					{changeSection(
						'01',
						null,
						<BiCommentDetail />,
						'Comentario (opcional)',
						<div className="comment-load">
							<input
								name={'comment-load'}
								id={'03_comment'}
								// onChange={loadComment}
								// value={commentContext.comment}
							/>
						</div>,
					)}
				</div>

				<Button
					className="button"
					text={startData ? 'EDITAR' : 'ENVIAR'}
					width={200}
					// disabled={!dataIsValid}
					// loading={loadingSendData}
					// onClick={() => setShowModal(true)}
				/>
			</div>
		</div>
	);
};

export default Profile;
