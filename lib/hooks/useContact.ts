import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContactFormData } from '../schemas/contact';

interface ContactSubmission extends ContactFormData {
  id: string;
  createdAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

// Submit contact form
export function useSubmitContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ContactFormData): Promise<ApiResponse<{ id: string; createdAt: Date }>> => {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch contacts for admin
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// Get all contacts (for admin)
export function useContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async (): Promise<ApiResponse<ContactSubmission[]>> => {
      const response = await fetch('/api/contacts');

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      return response.json();
    },
  });
}
