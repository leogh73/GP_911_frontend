import { useEffect } from 'react';
import InputField from './InputField';
import LoadingOverlay from 'react-loading-overlay';
import Button from './Button';
import Title from './Title';
import useForm from '../hooks/useForm';
import { IconContext } from 'react-icons';

const Form = ({ sendUserForm, title, icon, rememberMe, pageName, buttonText, footer }) => {
	const { inputs, loadStartInputs, changeHandler, validateForm, formIsValid, loading } = useForm(
		pageName,
		sendUserForm,
	);

	useEffect(() => {
		loadStartInputs();
		return () => {
			loadStartInputs();
		};
	}, [loadStartInputs]);

	return (
		<IconContext.Provider
			value={{ style: { color: 'slategray', minWidth: '50px', minHeight: '50px' } }}
		>
			<div className="myform">
				<LoadingOverlay
					active={loading}
					styles={{
						overlay: (base) => ({
							...base,
							background: 'rgba(255, 255, 255, 0.4)',
						}),
					}}
					spinner={
						<div
							className="spinner-border"
							style={{ width: '3rem', height: '3rem', color: '#1a73e8' }}
							role="status"
						>
							<span className="visually-hidden">Loading...</span>
						</div>
						// <Cargando />
					}
				>
					<div>
						<Title text={title} icon={icon} />
					</div>
					<form action="" method="" name="register" onSubmit={validateForm}>
						{inputs.map((f) => (
							<InputField
								key={f.key}
								name={f.name}
								section={f.section}
								password={f.password}
								icon={f.icon}
								errorMessage={f.errorMessage}
								value={f.value}
								onChange={changeHandler}
								placeHolder={f.placeHolder}
							/>
						))}
						{rememberMe}
						<div className="pt-2 text-center">
							<Button text={buttonText} width={250} disabled={!formIsValid} />
						</div>
						{footer}
					</form>
				</LoadingOverlay>
			</div>
		</IconContext.Provider>
	);
};

export default Form;
