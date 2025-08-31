// src/components/ContactForm/index.tsx
import React, { useState, useCallback } from 'react';
import { ContactService } from '@/services/contactService';
import styles from './ContactForm.module.css';

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
}

const services = [
  { value: '', label: 'Select a service...' },
  { value: 'video-editing', label: 'Video Editing' },
  { value: 'video-production', label: 'Video Production' },
  { value: 'motion-design', label: 'Motion Design' },
  { value: 'consultation', label: 'Consultation' }
];

const budgetRanges = [
  { value: '', label: 'Select budget range...' },
  { value: 'under-1k', label: 'Under $1,000' },
  { value: '1k-5k', label: '$1,000 - $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-plus', label: '$10,000+' },
  { value: 'discuss', label: 'Let\'s discuss' }
];

const timelines = [
  { value: '', label: 'Select timeline...' },
  { value: 'asap', label: 'ASAP' },
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: '1-month', label: '1 month' },
  { value: '2-3-months', label: '2-3 months' },
  { value: 'flexible', label: 'Flexible' }
];

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Формируем подробное сообщение
      const detailedMessage = `
Project Details:
Service: ${formData.service}
Budget: ${formData.budget}
Timeline: ${formData.timeline}

${formData.message}
      `.trim();

      // Отправляем через ContactService
      const success = await ContactService.submitContact(
        formData.name,
        formData.email,
        formData.company || '',
        detailedMessage
      );

      if (success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          service: '',
          budget: '',
          timeline: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Name */}
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={styles.input}
              required
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={styles.input}
              required
              placeholder="your.email@example.com"
            />
          </div>

          {/* Company */}
          <div className={styles.formGroup}>
            <label htmlFor="company" className={styles.label}>
              Company
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className={styles.input}
              placeholder="Your company name"
            />
          </div>

          {/* Service */}
          <div className={styles.formGroup}>
            <label htmlFor="service" className={styles.label}>
              Service *
            </label>
            <select
              id="service"
              value={formData.service}
              onChange={(e) => handleInputChange('service', e.target.value)}
              className={styles.select}
              required
            >
              {services.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div className={styles.formGroup}>
            <label htmlFor="budget" className={styles.label}>
              Budget Range *
            </label>
            <select
              id="budget"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className={styles.select}
              required
            >
              {budgetRanges.map((budget) => (
                <option key={budget.value} value={budget.value}>
                  {budget.label}
                </option>
              ))}
            </select>
          </div>

          {/* Timeline */}
          <div className={styles.formGroup}>
            <label htmlFor="timeline" className={styles.label}>
              Timeline *
            </label>
            <select
              id="timeline"
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              className={styles.select}
              required
            >
              {timelines.map((timeline) => (
                <option key={timeline.value} value={timeline.value}>
                  {timeline.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Project Details *
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className={styles.textarea}
            required
            placeholder="Tell us about your project, ideas, requirements, and any specific details you'd like to share..."
            rows={6}
          />
        </div>

        {/* Submit Button */}
        <div className={styles.submitContainer}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className={styles.successMessage}>
            Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className={styles.errorMessage}>
            Sorry, there was an error sending your message. Please try again or contact us directly.
          </div>
        )}
      </form>
    </div>
  );
};
