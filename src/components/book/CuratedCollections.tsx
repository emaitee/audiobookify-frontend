import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React from 'react'

function CuratedCollections() {
        const t = useTranslations('HomePage')
    const { theme } = useTheme()
  return (
<section className="md:px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{t('sections.curatedCollections')}</h2>
          <Link href={"/view-list?type=currated"} className={`text-sm flex items-center ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
            {t('common.explore')} <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { key:'best-of-the-year', title: t('collections.bestOfTheYear'), description: t('collections.bestOfTheYearDesc'), color: 'bg-emerald-500' },
            { key: 'staff-picks', title: t('collections.staffPicks'), description: t('collections.staffPicksDesc'), color: 'bg-purple-500' },
            { key: 'award-winners', title: t('collections.awardWinners'), description: t('collections.awardWinnersDesc'), color: 'bg-amber-500' },
            { key:'hidden-gems', title: t('collections.hiddenGems'), description: t('collections.hiddenGemsDesc'), color: 'bg-pink-500' },
          ].map((list) => (
            <div key={list.title} className="relative overflow-hidden rounded-lg shadow-lg">
              <div className={`absolute inset-0 ${list.color} opacity-90`}></div>
              <div className="relative p-4">
                <h3 className="font-bold mb-1">{list.title}</h3>
                <p className="text-xs opacity-90 mb-3">{list.description}</p>
                <Link href={"/view-list?type="+list.key} className={`text-xs font-medium ${theme === 'dark' ? 'bg-black bg-opacity-30' : 'bg-white bg-opacity-30'} px-3 py-1 rounded-full`}>
                  {t('common.viewList')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
  )
}

export default CuratedCollections