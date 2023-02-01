import React from 'react';
import Button from './Button';
import Title from './Title';

import '../pages/Changes';

const Message = ({ title, icon, body, buttonText, onClick }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'space-evenly',
				minHeight: '250px',
				minWidth: '400px',
				maxWidth: '850px',
				animation: 'bgFadeIn 0.6s ease',
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
			{buttonText && <Button text={buttonText} width={250} onClick={onClick} />}
		</div>
	);
};

export default Message;
