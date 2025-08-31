// src/components/MemoryDebugPanel/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { videoMemoryManager, getMemoryInfo } from '@/utils/VideoMemoryManager';
import styles from './MemoryDebugPanel.module.css';

// Локальный интерфейс для информации о памяти
interface LocalMemoryInfo {
  used: string;
  total: string;
  limit: string;
}

export const MemoryDebugPanel: React.FC = () => {
  const [memoryInfo, setMemoryInfo] = useState<LocalMemoryInfo | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const updateMemoryInfo = () => {
      const info = getMemoryInfo();
      setMemoryInfo(info);
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleForceCleanup = useCallback(() => {
    videoMemoryManager.forceCleanup();
    
    // Попытка принудительной сборки мусора
    setTimeout(() => {
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
    }, 100);
  }, []);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  if (!memoryInfo) return null;

  const memoryUsed = parseFloat(memoryInfo.used);
  const isHighMemory = memoryUsed > 500;

  return (
    <>
      {/* Кнопка для показа/скрытия панели */}
      <button
        className={`${styles.memoryButton} ${isHighMemory ? styles.memoryHigh : styles.memoryNormal}`}
        onClick={toggleVisibility}
        title={`Memory: ${memoryInfo.used}MB`}
      >
        <span className={styles.memoryIcon}>🧠</span>
        <span className={styles.memoryValue}>{memoryInfo.used}</span>
      </button>

      {/* Панель с подробной информацией */}
      {isVisible && (
        <div className={styles.memoryPanel}>
          <div className={styles.memoryHeader}>
            <strong>🧠 Memory Monitor</strong>
          </div>
          
          <div className={styles.memoryStats}>
            <div>
              <span>Used:</span>
              <span>{memoryInfo.used} MB</span>
            </div>
            <div>
              <span>Total:</span>
              <span>{memoryInfo.total} MB</span>
            </div>
            <div>
              <span>Limit:</span>
              <span>{memoryInfo.limit} MB</span>
            </div>
            <div>
              <span>Active Videos:</span>
              <span>{videoMemoryManager.activeVideoCount}</span>
            </div>
            <div>
              <span>Max Videos:</span>
              <span>{videoMemoryManager.maxVideos}</span>
            </div>
          </div>
          
          <button 
            onClick={handleForceCleanup}
            className={styles.cleanupButton}
          >
            🗑️ Force Cleanup
          </button>
          
          <div className={styles.memoryStatus}>
            Status: {isHighMemory ? '⚠️ High' : '✅ Normal'}
          </div>
        </div>
      )}
    </>
  );
};