import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import ChangeLoad from '../components/ChangeLoad';
import { useState } from 'react';
import CommentContext from '../context/CommentContext';

const ChangeEdit = ({ changeData }) => {
	const navigate = useNavigate();
	const [commentString, setCommentString] = useState('');

	const resultEditChange = (result) => {
		if (result && result._id) toast('Cambio modificado correctamente.', { type: 'success' });
		if (!result || result.error)
			toast('No se pudo completar la modificación del cambio.', { type: 'error' });
		navigate('/');
	};

	return (
		<CommentContext.Provider
			value={{
				comment: commentString,
				loadComment: setCommentString,
			}}
		>
			<ChangeLoad sendResult={resultEditChange} startData={changeData} />
		</CommentContext.Provider>
	);
};

export default ChangeEdit;
