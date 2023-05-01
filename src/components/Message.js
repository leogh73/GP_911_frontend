import React from 'react';
import Button from './Button';
import Title from './Title';

import '../pages/Changes';

const Message = ({ title, icon, body, buttonText, onClick }) => {
	return (
		<div
			style={{
				padding: '1em',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'space-evenly',
				maxHeight: '270px',
				maxWidth: '600px',
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
