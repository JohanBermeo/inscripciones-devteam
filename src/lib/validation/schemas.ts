import { z } from 'zod';

export const registrationSchema = z.object({
  fullName: z.string()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras y espacios'),

  email: z.string()
    .email('Correo electrónico inválido')
    .regex(/@udistrital\.edu\.co$/, 'Debe ser @udistrital.edu.co'),

  availabilityHours: z.coerce.number()
    .int('Debe ser número entero')
    .min(1, 'Mínimo 1 hora')
    .max(40, 'Máximo 40 horas'),

  specialtyArea: z.string()
    .min(2, 'Requerido')
    .max(100, 'Máximo 100 caracteres'),

  currentSemester: z.coerce.number()
    .int('Debe ser número entero')
    .min(2, 'Mínimo semestre 2')
    .max(14, 'Máximo semestre 14'),

  linkedinUrl: z.string()
    .url('URL inválida')
    .regex(/linkedin\.com/, 'Debe ser un perfil de LinkedIn (linkedin.com)')
    .optional()
    .or(z.literal('')),

  githubUrl: z.string()
    .url('URL inválida')
    .regex(/github\.com/, 'Debe ser un perfil de GitHub (github.com)')
    .optional()
    .or(z.literal('')),

  discordUsername: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50')
    .optional()
    .or(z.literal('')),

  motivation: z.string()
    .min(50, 'Mínimo 50 caracteres')
    .max(2000, 'Máximo 2000'),

  csrfToken: z.string().min(1, 'Token de seguridad inválido'),
  website: z.string().optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
