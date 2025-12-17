import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
  interest: z.enum(['participating', 'collaboration', 'sponsorship', 'helping', 'event'], {
    errorMap: () => ({ message: 'Please select a valid interest option' })
  }),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  agree: z.boolean()
    .refine(val => val === true, {
      message: 'You must agree to the privacy policy'
    })
});

export type ContactFormData = z.infer<typeof contactSchema>;
