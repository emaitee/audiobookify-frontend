import { Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { Book } from '@/app/[locale]/page';
import { authApiHelper } from '@/app/utils/api';
import { useRouter } from 'next/navigation';

const RecommendedForYou = () => {
  const { theme } = useTheme();
  const t = useTranslations('HomePage');
  const { user } = useAuth();
  const router = useRouter()
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      if (!user) return;
      
      try {
        const response = await authApiHelper.get('/spotlight/recommendations/personalized');
        if (response?.ok) {
          const books = await response.json();
          setRecommendedBooks(books.slice(0, 2));
        }
      } catch (error) {
        console.error('Failed to fetch recommended books', error);
      }
    };

    fetchRecommendedBooks();
  }, [user]);

  if (!user || recommendedBooks.length === 0) return null;

  const themeClasses = {
    container: theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200',
    link: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
    text: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    duration: theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
  };

  return (
    <section className="md:px-4 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center">
          <Star size={20} className="mr-2 text-purple-500" />
          {t('sections.recommendedForYou')}
        </h2>
        <Link
          href="/view-list?type=recommendations"
          className={`text-sm flex items-center ${themeClasses.link}`}
        >
          {t('common.seeAll')}
        </Link>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-3">
        {recommendedBooks.map((book) => (
          <div
            key={book._id}
            className={`flex-shrink-0 w-42 md: 58 ${themeClasses.container} rounded-lg p-3`}
            onClick={() => router.push(`/book/${book.slug}`)}
          >
            <div className="mb-2 rounded overflow-hidden">
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1 truncate">{book.title}</h3>
              <p className={`text-xs ${themeClasses.text} mb-1`}>
                {book.author.name}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star size={12} className="text-yellow-400 mr-1" />
                  <span className="text-xs">{book.averageRating.toFixed(1)}</span>
                </div>
                <span className={`text-xs ${themeClasses.duration}`}>
                  {Math.floor(book.duration / 3600)}h
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedForYou;