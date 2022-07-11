import React, { useState, useContext } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import Form from '../components/Form';
import Message from '../components/Message';
import UserContext from '../context/UserContext';
import useRememberMe from '../hooks/useRememberMe';

const Login = () => {
	const { rememberUser, loadUser } = useRememberMe();
	const [error, setError] = useState();
	const [rememberMe, setRememberMe] = useState(loadUser() ? true : false);
	const context = useContext(UserContext);

	const loginResult = (result, usernameOrPassword) => {
		if (result.token) {
			context.login(
				result.token,
				result.fullName,
				result.guardId,
				result.superior,
				result.userGuards,
				null,
			);
			// console.log(resultado)
			rememberUser(usernameOrPassword, rememberMe);
		}
		if (!result.token) setError(true);
	};

	return error ? (
		<Message
			title="Inicio de sesión fallido"
			icon="fas fa-exclamation-triangle fa-3x"
			body="No se pudo completar el inicio de sesión. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
			buttonText="VOLVER"
			onClick={() => setError(false)}
		/>
	) : (
		<Form
			sendUserForm={loginResult}
			pageName="login"
			title="Iniciar sesión"
			icon={<FaSignInAlt />}
			buttonText="INGRESAR"
			rememberMe={
				<div className="text-center pb-3">
					<input
						className="form-check-input"
						type="checkbox"
						id="rememberPasswordCheck"
						defaultChecked={rememberMe}
						onClick={(event) => {
							setRememberMe(event.target.checked);
						}}
					/>
					<label className="check-space" form="rememberPasswordCheck">
						Recordarme
					</label>
				</div>
			}
			footer={
				<div className="mb-1">
					<hr className="my-4" />
					<div className="form-group text-center">
						<a className="text-center" href="forgot-password.html">
							¿Olvidó su contraseña?
						</a>
					</div>
					{/* <div className="form-group">
						<p className="text-center">
							¿No es usuario? <Link to="/registro">Regístrese</Link>
						</p>
					</div> */}
				</div>
			}
		/>
	);
};

export default Login;
