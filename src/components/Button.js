const Button = ({ color, text, width, onClick, disabled, modal }) => {
	return (
		<button
			style={{ width: width }}
			className={`btn mybtn tx-tfm shadow-none ${disabled ? 'disabled' : ''}`}
			onClick={onClick}
			data-bs-dismiss={modal ? 'modal' : ''}
		>
			{text}
		</button>
	);
};

export default Button;
