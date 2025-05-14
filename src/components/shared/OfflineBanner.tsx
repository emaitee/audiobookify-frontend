import { useTheme } from 'next-themes';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface OfflineBannerProps {
  isOffline: boolean;
}

const OfflineBanner = ({ isOffline }: OfflineBannerProps) => {
  const t = useTranslations("HomePage");
  const { theme } = useTheme();
  
  if (!isOffline) return null;
  
  return (
    <div className={`p-2.5 text-center flex items-center justify-center gap-2 ${
      theme === 'dark' ? 'bg-yellow-900/60 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
    }`}>
      <AlertTriangle size={16} />
      <span className="text-sm">
        {t('offline.message')} - {t('offline.showingCachedData')}
      </span>
    </div>
  );
};

export default OfflineBanner;