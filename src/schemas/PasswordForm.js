import Joi from 'joi';

const schemaPassword = (type) =>
	type === 'change'
		? Joi.object({
				currentPassword: Joi.string().min(3).required().messages({
					'string.min': 'La contraseña debe ser de al menos 3 caracteres.',
					'string.empty': 'Ingrese su actual contraseña.',
				}),
				newPassword: Joi.string().invalid(Joi.ref('currentPassword')).min(3).required().messages({
					'string.min': 'La contraseña debe ser de al menos 3 caracteres.',
					'string.empty': 'Ingrese una nueva contraseña.',
					'any.invalid': 'La nueva contraseña no puede ser igual a la anterior.',
				}),
				repeatNewPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({
					'any.only': 'La contraseña no coincide.',
				}),
		  })
		: Joi.object({
				email: Joi.string()
					.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
					.required()
					.messages({
						'string.email': 'El correo electrónico ingresado es inválido.',
						'string.empty': 'Ingrese su correo electrónico.',
						'any.required': '',
					}),
		  });

export default schemaPassword;
