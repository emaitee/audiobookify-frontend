import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { authApiHelper } from '@/app/utils/api';
import { Narrator } from '@/app/[locale]/page-old';
import { useTranslations } from 'next-intl';

const NarratorSpotlight = () => {
    const { theme } = useTheme();
          const t = useTranslations('HomePage');
  const [spotlightNarrators, setSpotlightNarrators] = useState<Narrator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpotlightNarrators = async () => {
      try {
        setIsLoading(true);
        const response = await authApiHelper.get('/spotlight/narrators');
        
        if (response?.ok) {
          const narrators = await response.json();
          setSpotlightNarrators(narrators);
        }
      } catch (error) {
        console.error('Failed to fetch spotlight narrators', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotlightNarrators();
  }, []);

  const themeClasses = {
    container: theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200',
    link: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
    text: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    avatarBg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100',
    voiceStyle: theme === 'dark' ? 'bg-gray-700 text-purple-300' : 'bg-purple-50 text-purple-600'
  };

  if (isLoading) {
    return (
      <section className="px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center">
            <Mic size={20} className="mr-2 text-purple-500" />
            {t('sections.narratorSpotlight')}
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

  if (!isLoading && spotlightNarrators.length === 0) return null;

  return (
    <section className="px-4 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center">
          <Mic size={20} className="mr-2 text-purple-500" />
          {t('sections.narratorSpotlight')}
        </h2>
        <Link
          href="/narrators"
          className={`text-sm flex items-center ${themeClasses.link}`}
        >
          {t('common.seeAll')}
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {spotlightNarrators.map((narrator) => (
          <Link
            key={narrator._id}
            href={`/narrator/${narrator.slug}`}
            className={`rounded-lg p-3 flex flex-col items-center ${themeClasses.container} hover:shadow-md transition-shadow`}
          >
            <div className={`h-16 w-16 rounded-full ${themeClasses.avatarBg} flex items-center justify-center mb-2 overflow-hidden`}>
              {narrator.profileImage ? (
                <img
                  src={narrator.profileImage}
                  alt={narrator.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                  {narrator.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <h3 className="font-medium text-sm text-center mb-1">{narrator.name}</h3>
            {Array.isArray(narrator.voiceStyles) && narrator.voiceStyles.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1 mb-1">
                {(narrator.voiceStyles ?? []).slice(0, 2).map((style, index) => (
                  <span 
                    key={index} 
                    className={`text-xs px-2 py-1 rounded-full ${themeClasses.voiceStyle}`}
                  >
                    {style}
                  </span>
                ))}
              </div>
            )}
            <p className={`text-xs text-center ${themeClasses.text} line-clamp-2`}>
              {narrator.bio || t('common.noBioAvailable')}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NarratorSpotlight;