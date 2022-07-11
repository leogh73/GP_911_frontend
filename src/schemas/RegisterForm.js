import Joi from 'joi';

const schemaRegistro = Joi.object({
	username: Joi.string().min(4).max(15).required().messages({
		'string.min': 'El nombre de usuario debe ser de al menos 4 caracteres.',
		'string.max': 'El nombre de usuario puede tener como máximo de 15 caracteres.',
		'string.empty': 'Ingrese su nombre de usuario.',
		'any.required': 'Ingrese su nombre de usuario.',
	}),
	lastName: Joi.string().min(3).max(15).required().messages({
		'string.min': 'El apellido debe ser de al menos 3 caracteres.',
		'string.max': 'El nombre de usuario sólo puede ser como máximo de 15 caracteres',
		'string.empty': 'Ingrese su apellido.',
		'string.required': 'Ingrese su apellido.',
	}),
	firstName: Joi.string().min(3).max(15).required().messages({
		'string.min': 'El nombre debe ser de al menos 4 caracteres.',
		'string.max': 'El nombre de usuario sólo puede ser como máximo de 15 caracteres',
		'string.empty': 'Ingrese su nombre.',
	}),
	ni: Joi.number().min(100000).required().messages({
		'number.min': 'El NI deben ser al menos 6 números.',
		'number.base': 'Ingrese su NI.',
	}),
	section: Joi.string().valid('Monitoreo', 'Teléfono').required().messages({
		'any.only': 'Seleccione una sección.',
		'string.empty': 'Seleccione una sección.',
	}),
	guard: Joi.string().max(1).required().messages({
		'string.max': 'La guardia puede ser como máximo una letra.',
		'string.empty': 'Ingrese su guardia.',
	}),
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
		.required()
		.messages({
			'string.email': 'El correo electrónico ingresado es inválido.',
			'string.empty': 'Ingrese su correo electrónico.',
		}),
	password: Joi.string().min(3).required().messages({
		'string.min': 'La contraseña debe ser de al menos 3 caracteres.',
		'string.empty': 'Ingrese su contraseña.',
	}),
	repeatPassword: Joi.any().valid(Joi.ref('password')).required().messages({
		'any.only': 'La contraseña no coincide.',
	}),
});

export default schemaRegistro;
