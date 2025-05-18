'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
// import idb from '@/lib/idb'

export default function FilterComponent() {
  const t = useTranslations("Filters")
  const [availableGenres, setAvailableGenres] = useState<string[]>([])
  const [availableNarrators, setAvailableNarrators] = useState<string[]>([])
  const [dateFilters, setDateFilters] = useState<Array<{value: string, label: string}>>([])
  const [sortOptions, setSortOptions] = useState<Array<{value: string, label: string}>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  // Default selected values
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedNarrator, setSelectedNarrator] = useState('all')
  const [selectedDateFilter, setSelectedDateFilter] = useState('any')
  const [selectedSort, setSelectedSort] = useState('newest')

  const loadFilters = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 1. Try loading from IndexedDB cache first
      // const cached = await idb.getFilterOptions()
      
      // if (cached) {
      //   // Apply cached filters to state
      //   setAvailableGenres([t('allGenres'), ...cached.genres])
      //   setAvailableNarrators([t('allNarrators'), ...cached.narrators])
      //   setDateFilters(cached.dateFilters)
      //   setSortOptions(cached.sortOptions)
        
      //   // Set default selections
      //   setSelectedGenre(cached.defaults.genre)
      //   setSelectedNarrator(cached.defaults.narrator)
      //   setSelectedDateFilter(cached.defaults.dateFilter)
      //   setSelectedSort(cached.defaults.sortOrder)
      // }

      // 2. Fetch fresh data if online
      // if (navigator.onLine) {
        try {
          const response = await fetch('/books-info/filter-options')
          
          if (!response.ok) throw new Error('Network response was not ok')
          
          const { data } = await response.json()
          
          // Prepare the full filter options object
          const freshOptions = {
            genres: data.genres || [],
            narrators: data.narrators || [],
            dateFilters: data.dateFilters || [],
            sortOptions: data.sortOptions || [],
            defaults: data.defaults || {
              genre: 'all',
              narrator: 'all',
              dateFilter: 'any',
              sortOrder: 'newest'
            },
            lastUpdated: new Date().toISOString()
          }

          // Update state with fresh data
          setAvailableGenres([t('allGenres'), ...freshOptions.genres])
          setAvailableNarrators([t('allNarrators'), ...freshOptions.narrators])
          setDateFilters(freshOptions.dateFilters)
          setSortOptions(freshOptions.sortOptions)

          // Cache the fresh data
          // await idb.cacheFilterOptions(freshOptions)
          
        } catch (fetchError) {
          console.error('Failed to fetch fresh filters:', fetchError)
          // if (!cached) {
          //   setError(t('errors.loadFailed'))
          // }
        }
      // }
    } catch (error) {
      console.error('Error loading filters:', error)
      setError(t('errors.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  // Load filters on component mount
  useEffect(() => {
    loadFilters()
  }, [t])

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        <p>{error}</p>
        <button 
          onClick={loadFilters}
          className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded"
        >
          {t('retry')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {/* Genre Selector */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t('genre')}
        </label>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {availableGenres.map(genre => (
            <option key={genre} value={genre === t('allGenres') ? 'all' : genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Narrator Selector */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t('narrator')}
        </label>
        <select
          value={selectedNarrator}
          onChange={(e) => setSelectedNarrator(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {availableNarrators.map(narrator => (
            <option key={narrator} value={narrator === t('allNarrators') ? 'all' : narrator}>
              {narrator}
            </option>
          ))}
        </select>
      </div>

      {/* Date Filter */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t('dateRange')}
        </label>
        <select
          value={selectedDateFilter}
          onChange={(e) => setSelectedDateFilter(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="any">{t('anyTime')}</option>
          {dateFilters.map(filter => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Options */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t('sortBy')}
        </label>
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}