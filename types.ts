
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  link: string;
  type: string;
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  category: string;
  rating: number;
  year: number;
  type: 'movie' | 'series';
  videoUrl: string;
  downloadLinks?: { server: string; quality: string; size: string; url: string; }[];
  isDubbed?: boolean;
}
