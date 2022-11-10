import React from 'react';
import Button from './Button';
import Title from './Title';

const Message = ({ title, icon, body, buttonText, onClick }) => {
	return (
		<div
			className="content"
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'space-evenly',
				minHeight: '300px',
				minWidth: '400px',
			}}
		>
			<div>
				<Title text={title} icon={icon} />
			</div>
			<div
				style={{
					margin: '5px',
					paddingBottom: '12px',
					textAlign: 'center',
				}}
			>
				{body}
			</div>
			<Button text={buttonText} width={250} onClick={onClick} />
		</div>
	);
};

export default Message;
