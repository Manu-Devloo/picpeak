// Gallery Layout Types
export type GalleryLayoutType = 'grid' | 'masonry' | 'carousel' | 'timeline' | 'hero' | 'mosaic';

export interface GalleryLayoutSettings {
  // Common settings
  spacing?: 'tight' | 'normal' | 'relaxed';
  photoAnimation?: 'none' | 'fade' | 'scale' | 'slide';
  photoShape?: 'square' | 'rounded' | 'circle';
  
  // Grid specific
  gridColumns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  
  // Masonry specific
  masonryGutter?: number;
  
  // Carousel specific
  carouselAutoplay?: boolean;
  carouselInterval?: number;
  carouselShowThumbnails?: boolean;
  
  // Timeline specific
  timelineGrouping?: 'day' | 'week' | 'month';
  timelineShowDates?: boolean;
  
  // Hero specific
  heroImageId?: number;
  heroImagePosition?: 'top' | 'center' | 'bottom';
  heroOverlayOpacity?: number;
  
  // Mosaic specific
  mosaicPattern?: 'random' | 'structured' | 'alternating';
}

export interface ThemeConfig {
  // Colors
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  
  // Typography
  fontFamily?: string;
  headingFontFamily?: string;
  fontSize?: 'small' | 'normal' | 'large';
  
  // Styling
  borderRadius?: 'none' | 'sm' | 'md' | 'lg';
  buttonStyle?: 'solid' | 'outline' | 'ghost';
  shadowStyle?: 'none' | 'subtle' | 'normal' | 'dramatic';
  
  // Gallery Layout
  galleryLayout?: GalleryLayoutType;
  gallerySettings?: GalleryLayoutSettings;
  
  // Header/Footer
  headerStyle?: 'minimal' | 'standard' | 'full';
  footerStyle?: 'minimal' | 'standard' | 'full';
  showEventInfo?: boolean;
  showBranding?: boolean;
  
  // Advanced
  logoUrl?: string;
  customCss?: string;
  backgroundPattern?: 'none' | 'dots' | 'grid' | 'waves';
}

export interface EventTheme {
  id?: string;
  name: string;
  description?: string;
  thumbnail?: string;
  config: ThemeConfig;
  isPreset?: boolean;
}

// Preset theme definitions
export const GALLERY_THEME_PRESETS: Record<string, EventTheme> = {
  default: {
    name: 'Classic Grid',
    description: 'Clean and organized grid layout',
    config: {
      primaryColor: '#5C8762',
      accentColor: '#22c55e',
      backgroundColor: '#fafafa',
      textColor: '#171717',
      borderRadius: 'md',
      galleryLayout: 'grid',
      gallerySettings: {
        spacing: 'normal',
        photoAnimation: 'fade',
        gridColumns: { mobile: 2, tablet: 3, desktop: 4 }
      },
      headerStyle: 'standard',
      footerStyle: 'standard'
    },
    isPreset: true
  },
  
  elegantWedding: {
    name: 'Elegant Wedding',
    description: 'Sophisticated layout with hero image and timeline',
    config: {
      primaryColor: '#c9a961',
      accentColor: '#e6ddd4',
      backgroundColor: '#fdfcfb',
      textColor: '#3f3f3f',
      fontFamily: 'Playfair Display, serif',
      headingFontFamily: 'Playfair Display, serif',
      borderRadius: 'lg',
      shadowStyle: 'subtle',
      galleryLayout: 'hero',
      gallerySettings: {
        spacing: 'relaxed',
        photoAnimation: 'scale',
        photoShape: 'rounded',
        heroOverlayOpacity: 0.3
      },
      headerStyle: 'full',
      footerStyle: 'minimal'
    },
    isPreset: true
  },
  
  modernMasonry: {
    name: 'Modern Masonry',
    description: 'Pinterest-style dynamic layout',
    config: {
      primaryColor: '#3b82f6',
      accentColor: '#1e40af',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      fontFamily: 'Inter, sans-serif',
      borderRadius: 'sm',
      galleryLayout: 'masonry',
      gallerySettings: {
        spacing: 'tight',
        photoAnimation: 'fade',
        masonryGutter: 16
      },
      headerStyle: 'minimal',
      footerStyle: 'minimal',
      shadowStyle: 'normal'
    },
    isPreset: true
  },
  
  birthdayFun: {
    name: 'Birthday Celebration',
    description: 'Vibrant carousel with playful animations',
    config: {
      primaryColor: '#ec4899',
      accentColor: '#fbbf24',
      backgroundColor: '#fef3c7',
      textColor: '#451a03',
      fontFamily: 'Comic Neue, cursive',
      borderRadius: 'lg',
      galleryLayout: 'carousel',
      gallerySettings: {
        spacing: 'normal',
        photoAnimation: 'slide',
        carouselAutoplay: true,
        carouselInterval: 5000,
        carouselShowThumbnails: true
      },
      headerStyle: 'full',
      footerStyle: 'standard',
      backgroundPattern: 'dots'
    },
    isPreset: true
  },
  
  corporateTimeline: {
    name: 'Corporate Timeline',
    description: 'Professional chronological layout',
    config: {
      primaryColor: '#1f2937',
      accentColor: '#059669',
      backgroundColor: '#f9fafb',
      textColor: '#111827',
      fontFamily: 'IBM Plex Sans, sans-serif',
      borderRadius: 'sm',
      galleryLayout: 'timeline',
      gallerySettings: {
        spacing: 'normal',
        photoAnimation: 'none',
        timelineGrouping: 'day',
        timelineShowDates: true
      },
      headerStyle: 'standard',
      footerStyle: 'full',
      buttonStyle: 'outline'
    },
    isPreset: true
  },
  
  artisticMosaic: {
    name: 'Artistic Mosaic',
    description: 'Creative layout with varied photo sizes',
    config: {
      primaryColor: '#7c3aed',
      accentColor: '#f59e0b',
      backgroundColor: '#faf5ff',
      textColor: '#1e1b4b',
      fontFamily: 'Montserrat, sans-serif',
      borderRadius: 'none',
      galleryLayout: 'mosaic',
      gallerySettings: {
        spacing: 'tight',
        photoAnimation: 'scale',
        mosaicPattern: 'structured'
      },
      headerStyle: 'minimal',
      footerStyle: 'minimal',
      shadowStyle: 'dramatic'
    },
    isPreset: true
  }
};