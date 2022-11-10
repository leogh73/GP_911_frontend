import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
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
		context.login(result.token, result.fullName, result.guardId, result.superior);
		rememberUser(usernameOrPassword, rememberMe);
	};

	return error ? (
		<Message
			title="Inicio de sesión fallido"
			icon={<FaSignInAlt />}
			body="No se pudo completar el inicio de sesión. Intente nuevamente más tarde. Si el problema persiste, contacte al administrador. Disculpe las molestias ocasionadas."
			buttonText="VOLVER"
			onClick={() => setError(false)}
		/>
	) : (
		<>
			<Form
				sendUserForm={loginResult}
				pageName="login"
				formTitle="Iniciar sesión"
				icon={<FaSignInAlt />}
				buttonText="INGRESAR"
				rememberMe={
					<div className="remember-me">
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
					<div className="form-footer">
						<hr className="my-4" />
						{/* <div className="form-group text-center"> */}
						<Link className="text-center" to="forgot-password.html">
							¿Olvidó su contraseña?
						</Link>
						{/* </div> */}
						{/* <div className="form-group">
						<p className="text-center">
							¿No es usuario? <Link to="/registro">Regístrese</Link>
						</p>
					</div> */}
					</div>
				}
			/>
		</>
	);
};

export default Login;
