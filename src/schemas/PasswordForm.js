import Joi from 'joi';

const schemaPassword = (type) =>
	type === 'change'
		? Joi.object({
				oldPassword: Joi.string().min(3).required().messages({
					'string.min': 'La contraseña debe ser de al menos 3 caracteres.',
					'string.empty': 'Ingrese su actual contraseña.',
				}),
				newPassword: Joi.any().valid(Joi.ref('password')).required().messages({
					'string.min': 'La contraseña debe ser de al menos 3 caracteres.',
					'string.empty': 'Ingrese una nueva contraseña.',
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
					}),
		  });

export default schemaPassword;
