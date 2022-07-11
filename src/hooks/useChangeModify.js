import { useCallback, useContext, useState } from 'react';
import UserContext from '../context/UserContext';
import useHttpConnection from './useHttpConnection';

const useShiftModify = () => {
	const [loading, setLoading] = useState();
	const [error, setError] = useState(false);
	const [register, setRegister] = useState();
	const { fetchData } = useHttpConnection();

	const context = useContext(UserContext);

	const modifyChange = useCallback(
		async (action, changeId) => {
			try {
				setError(true);
				let consulta = await fetchData(
					`http://localhost:5000/api/change/${action}`,
					'POST',
					JSON.stringify({ changeId: changeId }),
					{
						authorization: `Bearer ${context.token}`,
						'Content-type': 'application/json',
					},
				);

				setLoading(false);
			} catch (error) {
				setError(true);
				console.log(error);
			}
		},
		[fetchData, context],
	);

	const resultModifyChange = (result) => {
		if (result && result._id) setRegister(true);
		if (!result || result.error) setError(true);
	};

	const goBack = () => {
		setError(false);
		setRegister(false);
	};

	return { loading, error, register, modifyChange, goBack };
};

export default useShiftModify;
