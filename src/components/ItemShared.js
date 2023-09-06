import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import {
	FaUser,
	FaExchangeAlt,
	FaUserClock,
	FaBuilding,
	FaUsers,
	FaCalendarDay,
	FaUserAlt,
	FaLink,
} from 'react-icons/fa';
import { BiComment, BiInfoCircle } from 'react-icons/bi';
import { IoMdTime } from 'react-icons/io';
import { BsCalendarDate } from 'react-icons/bs';
import { MdHistory, MdSupervisorAccount } from 'react-icons/md';
import { ImBook } from 'react-icons/im';

import Changelog from './Changelog';
import Modal from './Modal';
import Button from './Button';
import Title from './Title';

import './ChangeLoad.css';

const ItemShared = ({ type, data }) => {
	const translateSection = (section) => {
		let tSection = 'Monitoreo';
		if (section === 'Phoning') tSection = 'Telefonía';
		if (section === 'Dispatch') tSection = 'Despacho';
		return tSection;
	};

	const itemContent = () => {
		let itemData;
		if (type === 'change') {
			itemData = [
				[
					{
						key: 1,
						icon: <FaBuilding />,
						title: 'Sección',
						data: translateSection(data.section),
					},
				],
				[
					{
						key: 2,
						icon: <FaUserAlt />,
						title: 'Personal que cubre',
						data: data.coverData.name,
					},
					{
						key: 3,
						icon: <BsCalendarDate />,
						title: 'Fecha a cubrir',
						data: data.coverData.date,
					},
					{ key: 4, icon: <IoMdTime />, title: 'Horario a cubrir', data: data.coverData.shift },
					{ key: 5, icon: <FaCalendarDay />, title: 'Día a cubrir', data: data.coverData.day },
					{ key: 6, icon: <FaUsers />, title: 'Guardia a cubrir', data: data.coverData.guardId },
				],
				[
					{
						key: 7,
						icon: <FaUserAlt />,
						title: 'Personal que devuelve',
						data: data.returnData.name,
					},
					{
						key: 8,
						icon: <BsCalendarDate />,
						title: 'Fecha a devolver',
						data: data.returnData.date,
					},
					{
						key: 9,
						icon: <IoMdTime />,
						title: 'Horario a devolver',
						data: data.returnData.shift,
					},
					{
						key: 10,
						icon: <FaCalendarDay />,
						title: 'Día a devolver',
						data: data.returnData.day,
					},
					{
						key: 11,
						icon: <FaUsers />,
						title: 'Guardia a devolver',
						data: data.returnData.guardId,
					},
				],
				[
					{
						key: 12,
						icon: <BiInfoCircle />,
						title: 'Estado',
						data: data.status,
					},
				],
			];
		}
		if (data.motive)
			itemData.push([
				{
					key: 13,
					icon: <BiComment />,
					title: 'Motivo',
					data: data.motive,
				},
			]);
		if (type === 'affected') {
			itemData = [
				[
					{
						key: 1,
						icon: <FaUser />,
						title: 'Personal',
						data: data.name,
					},
					{
						key: 2,
						icon: <FaBuilding />,
						title: 'Sección',
						data: translateSection(data.section),
					},
				],
				[
					{
						key: 3,
						icon: <ImBook size={20} />,
						title: 'Foja del Libro de Guardia',
						data: data.bookPage,
					},
					{
						key: 4,
						icon: <MdSupervisorAccount size={20} />,
						title: 'Superior',
						data: data.superior,
					},
				],
				[
					{
						key: 5,
						icon: <BsCalendarDate />,
						title: 'Fecha afectado',
						data: data.affectedData.date,
					},
					{
						key: 6,
						icon: <IoMdTime />,
						title: 'Horario afectado',
						data: data.affectedData.shift,
					},
					{
						key: 7,
						icon: <FaCalendarDay />,
						title: 'Día afectado',
						data: data.affectedData.day,
					},
					{
						key: 8,
						icon: <FaUsers />,
						title: 'Guardia afectado',
						data: data.affectedData.guardId,
					},
				],
				[
					{
						key: 9,
						icon: <BsCalendarDate />,
						title: 'Fecha desafectado',
						data: data.disaffectedData.date,
					},
					{
						key: 10,
						icon: <IoMdTime />,
						title: 'Horario desafectado',
						data: data.disaffectedData.shift,
					},
					{
						key: 11,
						icon: <FaCalendarDay />,
						title: 'Día desafectado',
						data: data.disaffectedData.day,
					},
					{
						key: 12,
						icon: <FaUsers />,
						title: 'Guardia desafectado',
						data: data.disaffectedData.guardId,
					},
				],
			];
			if (data.comment)
				itemData.push([
					{
						key: 13,
						icon: <BiComment />,
						title: 'Comentario',
						data: data.comment,
					},
				]);
		}

		let itemComponent;
		if (type === 'change') {
			itemComponent = (
				<>
					{changeSection(
						itemData[0][0].key,
						itemData[0][0].icon,
						itemData[0][0].title,
						itemData[0][0].data,
					)}
					<div className="new-change-data">
						<div className="user-change-section">
							{itemData[1].map((d) => changeSection(d.key, d.icon, d.title, d.data))}
						</div>
						<div className="user-change-section">
							{itemData[2].map((d) => changeSection(d.key, d.icon, d.title, d.data))}
						</div>
					</div>
					<div className="user-change-section">
						{itemData[3].map((d) => changeSection(d.key, d.icon, d.title, d.data))}
					</div>
					{itemData[4] && (
						<>{itemData[4].map((d) => changeSection(d.key, d.icon, d.title, d.data, true))}</>
					)}
				</>
			);
		}
		if (type === 'affected') {
			itemComponent = (
				<>
					<div className="new-change-data">
						<div className="user-change-section">
							{itemData[0].map((d) => changeSection(d.key, d.icon, d.title, d.data))}
						</div>
						<div className="user-change-section">
							{itemData[1].map((d) => changeSection(d.key, d.icon, d.title, d.data))}
						</div>
					</div>
					<div className="new-change-data">
						<div className="user-change-section">
							{itemData[2].map((d) => changeSection(d.key, d.icon, d.title, d.data))}
						</div>
						<div className="user-change-section">
							{itemData[3].map((d) => changeSection(d.key, d.icon, d.title, d.data))}
						</div>
					</div>
					{itemData[4] && (
						<>{itemData[4].map((d) => changeSection(d.key, d.icon, d.title, d.data, true))}</>
					)}
				</>
			);
		}
		return itemComponent;
	};

	const changeSection = (key, icon, title, data, comment) =>
		comment ? (
			<div key={key} className="new-change-comment-data" style={{ border: 'O px' }}>
				<div className="user-section-comment">
					<div className="section-icon-comment">{icon}</div>
					<div className="section-text-comment">
						<div className="section-title">{title}</div>
						<div className="section-comment-data">{data}</div>
					</div>
				</div>
			</div>
		) : (
			<div key={key} className="user-section" style={{ border: 'O px' }}>
				<div className="user-section-content">
					<div className="section-icon">{icon}</div>
					<div className="section-text">
						<div className="section-title">{title}</div>
						{data}
					</div>
				</div>
			</div>
		);
	const shareHandler = async () => {
		try {
			await navigator.clipboard.writeText(
				// `https://guardias911.pages.dev/shared/${type}/${data._id}`,
				`http://localhost:3000/shared/${type}/${data._id}`,
			);
			toast('Enlace copiado', { type: 'info' });
		} catch (error) {
			toast('No se pudo copiar el enlace', { type: 'warning' });
		}
	};

	return (
		<div className="new-form" style={{ padding: '2em' }}>
			<Title
				icon={type === 'change' ? <FaExchangeAlt /> : <FaUserClock />}
				text={type === 'change' ? 'Cambio de guardia' : 'Personal afectado/desafectado'}
			/>
			{itemContent()}
			{/* {type === 'affected' && (
				<>{changeSection(13, <BiCommentDetail />, 'Comentario', data.comment, true)}</>
			)} */}
			<div className="new-change-data" style={{ justifyContent: 'space-around' }}>
				{type === 'change' && (
					<div style={{ padding: '8px' }}>
						<Modal
							id={(Math.random() + 1).toString(36).substring(4).replace(/\d+/g, '')}
							clickComponent={
								<Button
									className="button"
									text="Ver historial"
									width={180}
									icon={<MdHistory size={24} />}
								/>
							}
							texts={{
								title: 'Historial de edición',
								body: <Changelog log={data.changelog} />,
								close: 'Cerrar',
								comment: false,
							}}
							functions={{ action: null }}
							type="changelog"
						/>
					</div>
				)}
				<div style={{ padding: '8px' }}>
					<Button
						className="button"
						text="Copiar enlace"
						width={180}
						icon={<FaLink size={20} />}
						onClick={shareHandler}
					/>
				</div>
			</div>
		</div>
	);
};

export default ItemShared;
