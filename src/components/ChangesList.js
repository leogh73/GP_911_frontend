import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Change from './Change';
import UserContext from '../context/UserContext';
import Message from './Message';

const ChangesList = ({ changes }) => {
	const context = useContext(UserContext);

	const resultModifyChange = (action, result) => {
		context.activateActionRoute();
		context.loadAction(action);
		if (result && result._id) navigate('/success');
		if (!result || result.error) navigate('/error');
	};

	const navigate = useNavigate();

	return (
		<div className="lista-changes">
			<div className="bg-light mb-3 seccion-cambio text-center">
				<select
					className="lista-personal mt-2 mb-2 text-center"
					onChange={(e) => console.log('clasificar', e.target.value)}
				>
					<option value="clasificar" className="bg-disabled">
						Ordenar por
					</option>
					<option value="proximos">Próximos</option>
					<option value="fechaSolicitud">Fecha de solicitud</option>
					<option value="creador">Solicitante</option>
				</select>
			</div>
			<div className="accordion mb-3" id="accordionPanelsStayOpenExample">
				{changes.length ? (
					changes.map((ch) => (
						<Change
							key={Math.random() * 1000}
							change={ch}
							resultModifyChange={resultModifyChange}
						/>
					))
				) : (
					<Message
						title="No hay nuevos cambios."
						// body=""
						buttonText="Sin cambios"
						onClick={() => console.log('No hay cambios.')}
					/>
				)}
			</div>
		</div>
	);
};

export default ChangesList;
