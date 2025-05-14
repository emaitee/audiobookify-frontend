import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Author } from '@/app/[locale]/page-old';
import { authApiHelper } from '@/app/utils/api';
import { useTranslations } from 'next-intl';


const AuthorSpotlight = () => {
      const { theme } = useTheme();
      const t = useTranslations('HomePage');
  const [spotlightAuthors, setSpotlightAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpotlightAuthors = async () => {
      try {
        setIsLoading(true);
        const response = await authApiHelper.get('/spotlight/authors');
        
        if (response?.ok) {
          const authors = await response.json();
          setSpotlightAuthors(authors);
        }
      } catch (error) {
        console.error('Failed to fetch spotlight authors', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotlightAuthors();
  }, []);

  const themeClasses = {
    container: theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200',
    link: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
    text: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    avatarBg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
  };

  if (isLoading) {
    return (
      <section className="px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center">
            <BookOpen size={20} className="mr-2 text-purple-500" />
            {t('sections.authorSpotlight')}
          </h2>
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className={`rounded-lg p-3 ${themeClasses.container}`}>
              <div className={`h-16 w-16 rounded-full ${themeClasses.avatarBg} mb-2 mx-auto animate-pulse`} />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2 animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-1 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!isLoading && spotlightAuthors.length === 0) return null;

  return (
    <section className="px-4 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center">
          <BookOpen size={20} className="mr-2 text-purple-500" />
          {t('sections.authorSpotlight')}
        </h2>
        <Link
          href="/authors"
          className={`text-sm flex items-center ${themeClasses.link}`}
        >
          {t('common.seeAll')}
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {spotlightAuthors.map((author) => (
          <Link
            key={author._id}
            href={`/author/${author.slug}`}
            className={`rounded-lg p-3 flex flex-col items-center ${themeClasses.container} hover:shadow-md transition-shadow`}
          >
            <div className={`h-16 w-16 rounded-full ${themeClasses.avatarBg} flex items-center justify-center mb-2 overflow-hidden`}>
              {author.profileImage ? (
                <img
                  src={author.profileImage}
                  alt={author.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                  {author.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <h3 className="font-medium text-sm text-center mb-1">{author.name}</h3>
            <p className={`text-xs text-center ${themeClasses.text} line-clamp-2`}>
              {author.bio || t('common.noBioAvailable')}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AuthorSpotlight;