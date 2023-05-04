import './Button.css';
import Loading from './Loading';

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
					{loading ? <Loading type={'opened-button'} /> : <div className="bt-text">{text}</div>}
				</div>
			</button>
		</div>
	);
};

export default Button;
