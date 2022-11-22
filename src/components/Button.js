import { css } from '@emotion/react';
import { MoonLoader } from 'react-spinners';
import './Button.css';

const Button = ({ text, width, onClick, disabled, loading }) => {
	const override = css`
		margin: 0;
		display: center;
	`;

	return (
		<div style={{ width: width }} className="btn-container">
			<button
				style={{ width: `${width}` }}
				className={`button ${disabled || loading ? 'disabled' : ''}`}
				onClick={onClick}
				disabled={disabled}
			>
				<div className="bt-content">
					{loading ? (
						<MoonLoader color={'#fff'} css={override} size={18} />
					) : (
						<div className="bt-text">{text}</div>
					)}
				</div>
			</button>
		</div>
	);
};

export default Button;
