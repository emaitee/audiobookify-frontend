'use client'
import { useState, useEffect, useTransition } from 'react';
import { Globe } from 'lucide-react';
import { useRouter} from '@/i18n/navigation';
import {Locale} from 'next-intl';

export default function LanguageSelectionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  useEffect(() => {
    // Check if user has already selected a language
    const hasSelectedLanguage = localStorage.getItem('selectedLanguage');
    
    if (!hasSelectedLanguage) {
      setIsOpen(true);
    }
  }, []);
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  ];
  
  interface Language {
    code: string;
    name: string;
    flag: string;
  }

  const selectLanguage = (languageCode: string): void => {
    const nextLocale = languageCode as Locale;
    localStorage.setItem('selectedLanguage', languageCode);
    setIsOpen(false);
    // Here you would also set the language in your app's state/context
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-indigo-600 p-4 sm:p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
            <Globe className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="mt-3 text-lg sm:text-xl font-medium text-white">Select Your Language</h3>
          <p className="mt-2 text-sm sm:text-base text-indigo-100">Choose your preferred language to continue</p>
        </div>
        
        {/* Language Options */}
        <div className="p-4 sm:p-6 grid grid-cols-1 xs:grid-cols-2 gap-3 max-h-60 sm:max-h-96 overflow-y-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors duration-200"
            >
              <span className="text-lg sm:text-xl mr-2 sm:mr-3">{lang.flag}</span>
              <span className="text-gray-800 text-sm sm:text-base font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-center sm:justify-end">
          <button 
            onClick={() => selectLanguage('en')} 
            className="text-indigo-600 hover:text-indigo-800 text-sm sm:text-base font-medium"
          >
            Continue in English
          </button>
        </div>
      </div>
    </div>
  );
}