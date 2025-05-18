
import { Book } from '@/app/[locale]/page';
import BookShelf from './BookShelf';
import { Music } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface NewReleaseSectionProps {
  loading: { newReleases: boolean };
  error: { newReleases: string | null };
  newReleases: Book[];
  handlePlay: (book: Book) => void;
  isOffline: boolean;
}

const NewReleaseSection = ({
  loading,
  error,
  newReleases,
  handlePlay,
  isOffline
}: NewReleaseSectionProps) => {
  const t = useTranslations("HomePage");
  
  return (
    <BookShelf
      title={t('sections.newReleases')}
      books={newReleases}
      loading={loading.newReleases}
      error={error.newReleases}
      viewAllLink="/view-list?type=new-releases"
      viewAllText={t('common.viewAll')}
      onPlayBook={handlePlay}
      emptyMessage={isOffline ? t('errors.offlineNoData') : t('errors.noNewReleases')}
      icon={<Music size={20} />}
      layout="grid"
      aspectRatio="square"
    />
  );
};

export default NewReleaseSection;