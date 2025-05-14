import { useTheme } from 'next-themes';
import { Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import SectionHeader from '../shared/SectionHeader';

interface CategoryGridProps {
  categories: string[];
}

const CategoryGrid = ({ categories }: CategoryGridProps) => {
  const t = useTranslations("HomePage");
  const { theme } = useTheme();
  
  const categoryIcons: Record<string, string> = {
    'fiction': '📚',
    'mystery': '🔍',
    'romance': '❤️',
    'history': '🏛️',
    'business': '💼',
    'fantasy': '🧙‍♂️',
    'horror': '👻',
    'comedy': '🎭',
  };
  
  return (
    <section className="md:px-4 pb-8">
      <SectionHeader title={t('sections.browseCategories')} />
      
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category) => {
          const categoryKey = category.toLowerCase();
          const emoji = categoryIcons[categoryKey] || '🎵';
          
          return (
            <Link 
              href={`/view-list?category=${category}`}
              key={category} 
              className={`rounded-lg p-3 flex flex-col items-center ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white border border-gray-200 hover:shadow-md'
              } transition-all duration-300`}
            >
              <div className={`h-8 w-8 rounded-full ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              } flex items-center justify-center mb-2 text-lg`}>
                {emoji}
              </div>
              <span className="text-xs text-center">{category}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;