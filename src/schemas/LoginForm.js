import Joi from 'joi';

const schemaLogin = Joi.object({
	usernameOrEmail: Joi.string().messages({
		'string.empty': 'Complete el campo.',
		'any.empty': 'Complete el campo.',
	}),
	password: Joi.string().min(3).required().messages({
		'string.min': 'La contraseña debe ser de al menos 3 caracteres.',
		'string.empty': 'Ingrese su contraseña.',
	}),
});

export default schemaLogin;
