// src/components/ServicesSection/index.tsx
import React, { useState, useCallback, useMemo } from 'react';
import type { ServiceItem } from '@/types';
import styles from './ServicesSection.module.css';

export const ServicesSection: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<number>(0);

  const services = useMemo<ServiceItem[]>(() => [
    {
      title: "Video Editing",
      brief: "Professional post-production with color grading and motion graphics",
      features: [
        "Professional color grading",
        "Motion graphics & titles", 
        "Sound design & mixing",
        "Multiple format delivery",
        "2 revision rounds included"
      ],
      description: "Transform your raw footage into polished, professional content. Our editing process includes meticulous attention to pacing, storytelling, and visual aesthetics that align with your brand vision."
    },
    {
      title: "Video Production",
      brief: "Full-service production from concept development to final delivery",
      features: [
        "Concept development",
        "Professional filming",
        "Complete post-production", 
        "Equipment & crew included",
        "3 revision rounds included"
      ],
      description: "End-to-end video production service covering every aspect from initial concept through final delivery. We handle pre-production planning, professional filming, and comprehensive post-production."
    },
    {
      title: "Motion Design", 
      brief: "Engaging animations and motion graphics for brands and digital content",
      features: [
        "Custom animations",
        "Brand integration",
        "Social media formats",
        "Logo animations", 
        "2 revision rounds included"
      ],
      description: "Create compelling motion graphics that bring your brand to life. From logo animations to complex visual storytelling, we craft motion design that captures attention and communicates effectively."
    }
  ], []);

  const toggleAccordion = useCallback((index: number) => {
    setActiveAccordion(prev => prev === index ? -1 : index);
  }, []);

  return (
    <section id="services" className={styles.pageSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h1>Services</h1>
          <p>Professional video production services tailored to your creative vision</p>
        </div>
        
        <div className={styles.servicesContainer}>
          <div className={styles.accordion}>
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`${styles.accordionItem} ${activeAccordion === index ? styles.active : ''}`}
              >
                <div 
                  className={styles.accordionTrigger}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className={styles.accordionLeft}>
                    <div className={styles.accordionService}>{service.title}</div>
                    <div className={styles.accordionBrief}>{service.brief}</div>
                  </div>
                  <div className={styles.accordionToggle}></div>
                </div>
                
                <div className={styles.accordionContent}>
                  <div className={styles.accordionInner}>
                    <div className={styles.contentFeatures}>
                      {service.features.map((feature, idx) => (
                        <div key={idx} className={styles.featureItem}>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className={styles.contentDescription}>
                      {service.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};