import { useState } from 'react';
import { IconContext } from 'react-icons';
import './InputField.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import DropdownMenu from './Dropdown';

const InputField = ({ inputData, onChange }) => {
	const [showPassword, setShowPassword] = useState(false);

	const {
		name,
		optionsList,
		password,
		icon,
		errorMessage,
		value,
		placeHolder,
		disabled,
		profileView,
	} = inputData;

	const togglerPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<IconContext.Provider
			value={{ style: { color: 'slategray', backgroundColor: 'none', minWidth: '20px' } }}
		>
			{profileView && placeHolder}
			<div className="input-container">
				<div className={`input-box  ${errorMessage.length ? 'input-error' : ''}`}>
					<span name={name}>{icon}</span>
					{optionsList.length ? (
						<DropdownMenu
							name={name}
							value={value.length ? `${value}` : `${placeHolder}`}
							optionsList={optionsList}
							onChange={onChange}
							disabled={disabled}
							style={{ padding: 5, top: 33, fontSize: 16 }}
						/>
					) : (
						<input
							type={`${password ? (showPassword ? 'text' : 'password') : name}`}
							name={name}
							className={`${password ? 'border-end-0' : ''}`}
							onChange={onChange}
							value={value}
							placeholder={!profileView ? placeHolder : null}
							disabled={disabled}
						/>
					)}
					{password && (
						<span className="input-pass" onClick={togglerPassword}>
							{showPassword ? <FaEye /> : <FaEyeSlash />}
						</span>
					)}
				</div>
				<div className="text-error">{errorMessage}</div>
			</div>
		</IconContext.Provider>
	);
};

export default InputField;
