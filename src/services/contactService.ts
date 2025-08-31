// src/services/contactService.ts
import { supabase, type ContactSubmission } from '@/lib/supabase';

export class ContactService {
  // Отправить заявку
  static async submitContact(
    name: string,
    email: string,
    company: string,
    message: string
  ): Promise<boolean> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, simulating form submission');
        console.log('Contact form data:', { name, email, company, message });
        return true;
      }

      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name,
          email,
          company: company || null,
          message,
          is_read: false
        }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return false;
    }
  }

  // Админские функции
  static async getAllSubmissions(): Promise<ContactSubmission[]> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured');
        return [];
      }

      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      return [];
    }
  }

  static async markAsRead(id: string): Promise<boolean> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured');
        return false;
      }

      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking submission as read:', error);
      return false;
    }
  }

  static async deleteSubmission(id: string): Promise<boolean> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured');
        return false;
      }

      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting submission:', error);
      return false;
    }
  }
}
