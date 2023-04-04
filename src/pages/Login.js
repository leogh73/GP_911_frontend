import React, { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import Form from '../components/Form';
import Message from '../components/Message';
import UserContext from '../context/UserContext';
import useRememberMe from '../hooks/useRememberMe';

const Login = () => {
	const { rememberUser, loadUser } = useRememberMe();
	const [error, setError] = useState();
	const rememberMe = useRef(loadUser() ? true : false);
	const userContext = useContext(UserContext);

	const userLogin = (resultData, usernameOrPassword) => {
		console.log(resultData);
		userContext.login(resultData);
		rememberUser(usernameOrPassword, rememberMe.current);
	};

	const rememberMeClickHandler = (e) => {
		const checkedInput = document.querySelector('.form-check-input');
		const textClicked = e.target.classList.contains('check-space');
		if (textClicked) {
			checkedInput.checked = !checkedInput.checked;
			rememberMe.current = !rememberMe.current;
		} else {
			rememberMe.current = checkedInput.checked;
		}
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
				sendUserForm={userLogin}
				pageName="login"
				formTitle="Iniciar sesión"
				icon={<FaSignInAlt />}
				buttonText="INGRESAR"
				// profileView={false}
				rememberMe={
					<div className="remember-me" onClick={rememberMeClickHandler}>
						<input
							className="form-check-input"
							name="remember-me"
							type="checkbox"
							defaultChecked={rememberMe.current}
						/>
						<label className="check-space" form="rememberPasswordCheck">
							Recordarme
						</label>
					</div>
				}
				footer={
					<div className="form-footer">
						<div className="separator" />
						<Link className="text-center" to="/forgotpassword">
							¿Olvidó su contraseña?
						</Link>
					</div>
				}
			/>
		</>
	);
};

export default Login;
