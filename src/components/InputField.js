import { useState } from 'react';
import { IconContext } from 'react-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputField = ({
	name,
	section,
	password,
	icon,
	errorMessage,
	value,
	onChange,
	placeHolder,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const [selector, setSelector] = useState(false);

	const activateSelector = () => {
		setSelector(true);
	};

	const togglerPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<IconContext.Provider value={{ style: { color: 'slategray', minWidth: '20px' } }}>
			<div className="mb-3 txt_field">
				<div className={`input-group  ${errorMessage.length ? 'campo-error' : ''}`}>
					<span name={name} className="input-group-text">
						{icon}
					</span>
					{section ? (
						<select
							className={`form-select ${selector || errorMessage.length ? '' : 'texto-inactivo'}`}
							aria-label="Default select example"
							name={name}
							onChange={onChange}
							onFocus={activateSelector}
						>
							<option className="texto-seccion" value="Sección">
								Sección
							</option>
							<option value="Monitoreo">Monitoreo</option>
							<option value="Teléfono">Teléfono</option>
						</select>
					) : (
						<input
							type={`${password ? (showPassword ? 'text' : 'password') : name}`}
							name={name}
							className={`form-control ${password ? 'border-end-0' : ''}`}
							onChange={onChange}
							value={value}
							placeholder={placeHolder}
						/>
					)}
					{password ? (
						<span className="input-group-text input-pass" onClick={togglerPassword}>
							{showPassword ? <FaEye /> : <FaEyeSlash />}
						</span>
					) : (
						''
					)}
				</div>
				<div className="text-danger">{errorMessage}</div>
				{/* {errorMessage.map((error) => {
				return (
					<div key={Math.random() * 1000} className="text-danger">
						{error}
					</div>
				);
			})} */}
			</div>
		</IconContext.Provider>
	);
};

export default InputField;
