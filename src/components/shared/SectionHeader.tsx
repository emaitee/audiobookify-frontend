import { useTheme } from 'next-themes';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
  icon?: React.ReactNode;
}

const SectionHeader = ({ 
  title, 
  viewAllLink, 
  viewAllText = 'View All',
  icon
}: SectionHeaderProps) => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        {icon && <span className="mr-2 text-purple-500">{icon}</span>}
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      
      {viewAllLink && (
        <Link 
          href={viewAllLink} 
          className={`text-sm flex items-center ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}
        >
          {viewAllText} <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;