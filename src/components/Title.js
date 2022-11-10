import React from 'react';
import { IconContext } from 'react-icons';

const Title = ({ text, icon }) => {
	return (
		<IconContext.Provider
			value={{ style: { color: 'slategray', minWidth: '50px', minHeight: '50px' } }}
		>
			<div
				style={{
					fontSize: 'large',
					paddingTop: '5px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{icon}
				<h2 style={{ padding: '8px', letterSpacing: '0.5px' }}>{text}</h2>
			</div>
		</IconContext.Provider>
	);
};

export default Title;
