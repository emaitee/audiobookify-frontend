'use client'
import { useTranslations } from 'next-intl'
import { FilterOptions } from '@/lib/idb'

interface FilterPanelProps {
  isOpen: boolean
  genres: string[]
  narrators: string[]
  selectedGenre: string
  selectedNarrator: string
  selectedDateFilter: string
  onGenreChange: (genre: string) => void
  onNarratorChange: (narrator: string) => void
  onDateFilterChange: (filter: string) => void
  filterOptions: FilterOptions
}

export default function FilterPanel({
  isOpen,
  genres,
  narrators,
  selectedGenre,
  selectedNarrator,
  selectedDateFilter,
  onGenreChange,
  onNarratorChange,
  onDateFilterChange,
  filterOptions,
  t
}: FilterPanelProps & { t: any }) {
  if (!isOpen) return null

  return (
    <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Genre filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">{t('filter.genre')}</h3>
        <select 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      {/* Narrator filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">{t('filter.narrator')}</h3>
        <select 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedNarrator}
          onChange={(e) => onNarratorChange(e.target.value)}
        >
          {narrators.map((narrator) => (
            <option key={narrator} value={narrator}>{narrator}</option>
          ))}
        </select>
      </div>

      {/* Release date filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">{t('filter.releaseDate')}</h3>
        <div className="flex space-x-2">
          <select 
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedDateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
          >
            <option value="any">{t('filter.dateOptions.any')}</option>
            {filterOptions.dateFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}