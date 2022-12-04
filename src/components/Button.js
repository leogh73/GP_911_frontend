import './Button.css';

const Button = ({ text, width, onClick, disabled, loading }) => {
	return (
		<div style={{ width: width }} className="btn-container">
			<button
				style={{ width: `${width}` }}
				className={`button ${disabled || loading ? 'disabled' : ''}`}
				onClick={onClick}
				disabled={disabled}
			>
				<div className="bt-content">
					<div className="bt-text">{text}</div>
				</div>
			</button>
		</div>
	);
};

export default Button;
