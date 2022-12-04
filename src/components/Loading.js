import './Loading.css';

const Loading = ({ type }) => {
	const innerColor = localStorage.getItem('mode') === 'light-mode' ? '#2a7be4' : '#18191a';

	const selectSpinner = () => {
		switch (type) {
			case 'closed':
				return <div className="spinner1" style={{ borderTopColor: innerColor }}></div>;
			case 'opened':
				return <div className="spinner2" style={{ borderRightColor: 'transparent' }}></div>;
			default:
				break;
		}
	};

	return <>{selectSpinner()}</>;
};

export default Loading;
