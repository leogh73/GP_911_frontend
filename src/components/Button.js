import { IconContext } from 'react-icons';
import './Button.css';
import Loading from './Loading';

const Button = ({ text, width, height, onClick, disabled, loading, icon }) => {
	return (
		<IconContext.Provider
			value={{
				style: { color: 'white' },
			}}
		>
			<div className="btn-container">
				<button
					style={{ width: `${width}`, height: `${height}` }}
					className={`button ${disabled || loading ? 'disabled' : ''}`}
					onClick={onClick}
					disabled={disabled}
				>
					<div className="bt-content">
						{loading ? (
							<Loading type={'opened-button'} />
						) : (
							<>
								{icon}
								<div className="bt-text">{text}</div>
							</>
						)}
					</div>
				</button>
			</div>
		</IconContext.Provider>
	);
};

export default Button;
