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
        console.warn('Supabase not configured, using demo data');
        // Demo data for development
        return [
          {
            id: 'contact-demo-1',
            name: 'John Smith',
            email: 'john@example.com',
            company: 'Creative Agency',
            message: 'Hi! We are interested in your video production services for our upcoming marketing campaign. Could you please send us more information about pricing and availability?',
            is_read: false,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
          },
          {
            id: 'contact-demo-2',
            name: 'Maria Rodriguez',
            email: 'maria@techcorp.com',
            company: 'TechCorp',
            message: 'We need a product showcase video for our new app launch. Can we schedule a call to discuss the project details and timeline?',
            is_read: true,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
          },
          {
            id: 'contact-demo-3',
            name: 'Alex Chen',
            email: 'alex.chen@startup.io',
            company: 'StartupIO',
            message: 'Looking for a creative team to help with our brand story video. Your portfolio looks amazing! What is your typical project timeline?',
            is_read: false,
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
          }
        ];
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
        console.warn('Supabase not configured, simulating mark as read');
        return true;
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
        console.warn('Supabase not configured, simulating delete');
        return true;
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
