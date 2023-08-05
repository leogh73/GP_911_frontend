import { IconContext } from 'react-icons';
import Modal from './Modal';
import Loading from './Loading';

import './OptionsButtons.css';

const button = (data, selectedData, icon, idModal, texts, functions, type) => {
	let isSelected = false;
	if (!!data) isSelected = selectedData.id === data._id && texts.id === selectedData.button;
	return (
		<IconContext.Provider
			value={{
				style: { color: 'white' },
			}}
		>
			<div className="option-container">
				<Modal
					id={idModal}
					texts={texts}
					functions={functions}
					clickComponent={
						<div
							className="option-button"
							style={{ backgroundColor: `${isSelected ? 'var(--disabled-button)' : ''}` }}
						>
							{isSelected ? <Loading type={'opened-button'} /> : icon}
						</div>
					}
					type={type}
				/>
			</div>
		</IconContext.Provider>
	);
};

export default button;
