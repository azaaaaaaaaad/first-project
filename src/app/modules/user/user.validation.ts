import { z } from 'zod';
import { UserStatus } from './user.constant';

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'pass must be a string'
    })
    .max(20, { message: 'pass cannot be more than 20 characters' }).optional()
});

const changeValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]])
  })
})

export const UserValidation = {
  userValidationSchema,
  changeValidationSchema
};
