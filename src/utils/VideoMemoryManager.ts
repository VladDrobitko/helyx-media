// src/utils/VideoMemoryManager.ts
// Оптимизированная система управления памятью для видео

interface VideoStats {
  id: string;
  element: HTMLVideoElement;
  lastActivity: number;
  loopCount: number;
  memoryFootprint: number;
}

class VideoMemoryManager {
  private activeVideos = new Map<HTMLVideoElement, VideoStats>();
  private memoryCheckInterval: NodeJS.Timeout | null = null;
  private readonly maxActiveVideos = 3;
  private readonly maxMemoryThreshold = 800; // MB
  private readonly cleanupInterval = 30000; // 30 seconds
  private readonly maxLoopsBeforeReload = 10;
  
  constructor() {
    this.startMonitoring();
    this.setupGlobalEventListeners();
  }

  /**
   * Регистрирует новое видео в системе управления памятью
   */
  public addVideo(videoElement: HTMLVideoElement, id?: string): void {
    if (!videoElement) return;

    const videoId = id || this.generateVideoId();
    const stats: VideoStats = {
      id: videoId,
      element: videoElement,
      lastActivity: Date.now(),
      loopCount: 0,
      memoryFootprint: this.estimateVideoMemoryFootprint(videoElement)
    };

    this.activeVideos.set(videoElement, stats);
    this.setupVideoEventListeners(videoElement, stats);
    this.enforceMemoryLimits();
    
    console.log(`Video registered: ${videoId}, Active videos: ${this.activeVideos.size}`);
  }

  /**
   * Удаляет видео из системы управления памятью
   */
  public removeVideo(videoElement: HTMLVideoElement): void {
    const stats = this.activeVideos.get(videoElement);
    if (stats) {
      this.cleanupVideoElement(videoElement);
      this.activeVideos.delete(videoElement);
      console.log(`Video removed: ${stats.id}, Active videos: ${this.activeVideos.size}`);
    }
  }

  /**
   * Принудительная очистка всех видео
   */
  public forceCleanup(): void {
    console.log('Forcing video memory cleanup...');
    
    this.activeVideos.forEach((stats, video) => {
      this.cleanupVideoElement(video, true);
    });

    // Запуск сборки мусора если доступна
    this.requestGarbageCollection();
  }

  /**
   * Обновляет счетчик циклов для видео
   */
  public updateLoopCount(videoElement: HTMLVideoElement): number {
    const stats = this.activeVideos.get(videoElement);
    if (stats) {
      stats.loopCount++;
      stats.lastActivity = Date.now();
      
      // Если достигли максимума циклов, перезагружаем видео
      if (stats.loopCount >= this.maxLoopsBeforeReload) {
        console.log(`Reloading video ${stats.id} after ${stats.loopCount} loops`);
        this.reloadVideo(videoElement, stats);
        return 0;
      }
      
      return stats.loopCount;
    }
    return 0;
  }

  /**
   * Получение статистики использования памяти
   */
  public getMemoryStats(): {
    activeVideos: number;
    totalEstimatedMemory: number;
    systemMemory: MemoryInfo | null;
  } {
    const totalEstimatedMemory = Array.from(this.activeVideos.values())
      .reduce((total, stats) => total + stats.memoryFootprint, 0);

    return {
      activeVideos: this.activeVideos.size,
      totalEstimatedMemory,
      systemMemory: this.getSystemMemoryInfo()
    };
  }

  /**
   * Уничтожение менеджера и очистка всех ресурсов
   */
  public destroy(): void {
    console.log('Destroying VideoMemoryManager...');
    
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }

    this.forceCleanup();
    this.activeVideos.clear();
  }

  // Приватные методы

  private generateVideoId(): string {
    return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private estimateVideoMemoryFootprint(video: HTMLVideoElement): number {
    // Примерная оценка используемой памяти в MB
    const width = video.videoWidth || 1920;
    const height = video.videoHeight || 1080;
    const duration = video.duration || 60;
    
    // Формула: width * height * 3 (RGB) * fps * duration / (1024 * 1024) / compression_ratio
    const estimatedMB = (width * height * 3 * 30 * Math.min(duration, 10)) / (1024 * 1024) / 50;
    return Math.max(estimatedMB, 50); // Минимум 50MB
  }

  private setupVideoEventListeners(video: HTMLVideoElement, stats: VideoStats): void {
    const updateActivity = () => {
      stats.lastActivity = Date.now();
    };

    const handleEnded = () => {
      this.updateLoopCount(video);
    };

    // Сохраняем ссылки на обработчики для возможности удаления
    (video as any).__memoryManagerHandlers = {
      updateActivity,
      handleEnded
    };

    video.addEventListener('play', updateActivity);
    video.addEventListener('pause', updateActivity);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', () => {
      console.error(`Video error for ${stats.id}`);
      this.removeVideo(video);
    });
  }

  private cleanupVideoElement(video: HTMLVideoElement, force = false): void {
    try {
      if (video && video.parentNode) {
        video.pause();
        
        if (force) {
          // Более агрессивная очистка
          video.removeAttribute('src');
          video.load();
          
          // Удаляем все event listeners
          const newVideo = video.cloneNode(true) as HTMLVideoElement;
          video.parentNode?.replaceChild(newVideo, video);
        }
      }
    } catch (error) {
      console.error('Error during video cleanup:', error);
    }
  }

  private reloadVideo(video: HTMLVideoElement, stats: VideoStats): void {
    const currentSrc = video.src;
    const wasPlaying = !video.paused;
    
    video.pause();
    video.removeAttribute('src');
    video.load();
    
    // Восстанавливаем видео после небольшой задержки
    setTimeout(() => {
      video.src = currentSrc;
      video.load();
      
      if (wasPlaying) {
        video.play().catch(console.error);
      }
      
      stats.loopCount = 0;
      stats.lastActivity = Date.now();
    }, 100);
  }

  private enforceMemoryLimits(): void {
    // Ограничение по количеству активных видео
    if (this.activeVideos.size > this.maxActiveVideos) {
      this.removeOldestVideos(this.activeVideos.size - this.maxActiveVideos);
    }

    // Проверка общего использования памяти
    const memoryInfo = this.getSystemMemoryInfo();
    if (memoryInfo && this.isMemoryThresholdExceeded(memoryInfo)) {
      this.performMemoryOptimization();
    }
  }

  private removeOldestVideos(count: number): void {
    const sortedVideos = Array.from(this.activeVideos.entries())
      .sort(([, a], [, b]) => a.lastActivity - b.lastActivity);

    for (let i = 0; i < count && i < sortedVideos.length; i++) {
      const [video, stats] = sortedVideos[i];
      console.log(`Removing old video: ${stats.id}`);
      this.removeVideo(video);
    }
  }

  private isMemoryThresholdExceeded(memoryInfo: MemoryInfo): boolean {
    const usedMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
    return usedMB > this.maxMemoryThreshold;
  }

  private performMemoryOptimization(): void {
    console.log('Performing memory optimization...');
    
    // Приостанавливаем неактивные видео
    const now = Date.now();
    const inactivityThreshold = 60000; // 1 минута
    
    this.activeVideos.forEach((stats, video) => {
      if (now - stats.lastActivity > inactivityThreshold && !video.paused) {
        console.log(`Pausing inactive video: ${stats.id}`);
        video.pause();
      }
    });

    // Запрашиваем сборку мусора
    this.requestGarbageCollection();
  }

  private getSystemMemoryInfo(): MemoryInfo | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  private requestGarbageCollection(): void {
    // Попытка запуска сборки мусора если доступна
    if ('gc' in window && typeof (window as any).gc === 'function') {
      setTimeout(() => {
        try {
          (window as any).gc();
          console.log('Manual garbage collection triggered');
        } catch (error) {
          console.warn('Failed to trigger garbage collection:', error);
        }
      }, 100);
    }
  }

  private startMonitoring(): void {
    this.memoryCheckInterval = setInterval(() => {
      this.performPeriodicMaintenance();
    }, this.cleanupInterval);
  }

  private performPeriodicMaintenance(): void {
    const memoryInfo = this.getSystemMemoryInfo();
    
    if (memoryInfo) {
      const usedMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
      
      if (usedMB > this.maxMemoryThreshold) {
        console.warn(`High memory usage detected: ${usedMB.toFixed(2)}MB, performing cleanup...`);
        this.performMemoryOptimization();
      }
    }

    // Обновляем статистику активности видео
    this.updateVideoActivity();
  }

  private updateVideoActivity(): void {
    const now = Date.now();
    const staleThreshold = 300000; // 5 минут

    this.activeVideos.forEach((stats, video) => {
      // Удаляем видео которые не использовались долгое время
      if (now - stats.lastActivity > staleThreshold && video.paused) {
        console.log(`Removing stale video: ${stats.id}`);
        this.removeVideo(video);
      }
    });
  }

  private setupGlobalEventListeners(): void {
    // Очистка при уходе со страницы
    window.addEventListener('beforeunload', () => {
      this.destroy();
    });

    // Очистка при скрытии страницы
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.activeVideos.forEach((stats, video) => {
          if (!video.paused) {
            video.pause();
            console.log(`Paused video ${stats.id} due to page visibility change`);
          }
        });
      }
    });
  }

  // Геттеры для отладки
  public get activeVideoCount(): number {
    return this.activeVideos.size;
  }

  public get maxVideos(): number {
    return this.maxActiveVideos;
  }

  public getVideoStats(video: HTMLVideoElement): VideoStats | undefined {
    return this.activeVideos.get(video);
  }

  public getAllVideoStats(): VideoStats[] {
    return Array.from(this.activeVideos.values());
  }
}

// Типы
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// Создаем и экспортируем единственный экземпляр
export const videoMemoryManager = new VideoMemoryManager();

// Утилиты для работы с памятью
export const getMemoryInfo = (): {
  used: string;
  total: string;
  limit: string;
} | null => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
      total: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
      limit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)
    };
  }
  return null;
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Экспорт типов для использования в других файлах
export type { VideoStats, MemoryInfo };