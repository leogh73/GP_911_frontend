import React from 'react';

const Title = ({ text, icon }) => {
	return (
		<div className="col-md-12 text-center mb-4">
			<div className="mb-2">{icon}</div>
			<h2>{text}</h2>
		</div>
	);
};

export default Title;
