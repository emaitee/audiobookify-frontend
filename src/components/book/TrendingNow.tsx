'use client'
import { TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { authApiHelper } from '@/app/utils/api';
import { Book } from '@/app/[locale]/page-old';
import { useRouter } from 'next/navigation';

const TrendingNow = () => {
  const { theme } = useTheme();
  const t = useTranslations('HomePage');
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await authApiHelper.get('/books-info/trending');
        if (response?.ok) {
          const books = await response.json();
          setTrendingBooks(books.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch trending books', error);
      }
    };

    fetchTrendingBooks();
  }, []);

  if (trendingBooks.length === 0) return null;

  const themeClasses = {
    container: theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200',
    link: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
    text: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    secondaryText: theme === 'dark' ? 'text-gray-500' : 'text-gray-600',
    duration: theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
  };

  return (
    <section className="md:px-4 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center">
          <TrendingUp size={20} className="mr-2 text-purple-500" />
          {t('sections.trendingNow')}
        </h2>
        <Link
          href="/view-list?type=trending"
          className={`text-sm flex items-center ${themeClasses.link}`}
        >
          {t('common.seeAll')}
        </Link>
      </div>

      <div className="space-y-3">
        {trendingBooks.map((book) => (
          <div
            key={book._id}
            className={`flex items-center ${themeClasses.container} rounded-lg py-3 px-2`}
            onClick={() => router.push(`/book/${book.slug}`)}
          >
            <div className="w-12 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-sm mb-1">{book.title}</h3>
                  <p className={`text-xs ${themeClasses.text}`}>
                    {book.author.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <Star size={12} className="text-yellow-400 mr-1" />
                  <span className="text-xs">{book.averageRating.toFixed(1)}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className={`text-xs ${themeClasses.secondaryText}`}>
                  {book.listenCount?.toLocaleString()} {t('common.listens')}
                </div>
                <span className={`text-xs ${themeClasses.duration}`}>
                  {Math.floor((book.duration || 0) / 3600)}h
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingNow;