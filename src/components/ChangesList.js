import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Change from './Change';
import UserContext from '../context/UserContext';
import Message from './Message';
import Title from './Title';
import { IconContext } from 'react-icons';

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
			<div className="bg-light mb-3 section-change text-center">
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
					<IconContext.Provider
						value={{
							style: {
								color: 'slategray',
								minWidth: '50px',
								minHeight: '50px',
								marginBottom: '5px',
							},
						}}
					>
						<div className="pt-3 pb-3 text-center">
							<div>
								<Title text={'No hay nuevos cambios.'} />
							</div>
						</div>
					</IconContext.Provider>
				)}
			</div>
		</div>
	);
};

export default ChangesList;
