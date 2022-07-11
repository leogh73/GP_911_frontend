import React from 'react';
import Button from './Button';
import Title from './Title';
import { IconContext } from 'react-icons';

const Message = ({ title, icon, body, buttonText, onClick }) => {
	return (
		<IconContext.Provider
			value={{
				style: { color: 'slategray', minWidth: '50px', minHeight: '50px', marginBottom: '5px' },
			}}
		>
			<div className="myform">
				<div>
					<Title text={title} icon={icon} />
				</div>
				<p className="pb-1 text-center">{body}</p>
				<div className="pt-2 pb-2 text-center">
					<Button text={buttonText} width={250} onClick={onClick} />
				</div>
			</div>
		</IconContext.Provider>
	);
};

export default Message;
