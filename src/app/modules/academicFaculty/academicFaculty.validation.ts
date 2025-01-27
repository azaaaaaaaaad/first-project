import { z } from 'zod';

const createAcademicValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty Must be a string',
    }),
  }),
});

const updateAcademicValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty Must be a string',
    }),
  }),
});

export const AcademicFacultyValidations = {
  createAcademicValidationSchema,
  updateAcademicValidationSchema,
};
