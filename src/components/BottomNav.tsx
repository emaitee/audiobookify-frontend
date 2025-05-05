'use client'
import React from 'react'
import { Search, Home, User, BookOpen, Library, BarChart2, Book } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext' // Adjust the import path as needed
import Link from 'next/link'

interface NavItem {
  path: string
  icon: React.ReactNode
  activeIcon: React.ReactNode
  label: string
  adminOnly?: boolean
}

function ResponsiveNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrollDirection, setScrollDirection] = useState('up')
  const [prevScrollY, setPrevScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const { isAuthenticated, user } = useAuth() // Assuming your auth context provides user role

  // Filter nav items based on authentication and admin status
  const getFilteredNavItems = () => {
    const baseItems: NavItem[] = [
      { 
        path: '/', 
        icon: <Home size={22} strokeWidth={1.5} color='#fff' />, 
        activeIcon: <Home size={22} strokeWidth={2} fill="#4f46e5" />,
        label: 'Home' 
      },
      { 
        path: '/library', 
        icon: <Library size={22} strokeWidth={1.5} color='#fff' />, 
        activeIcon: <Library size={22} strokeWidth={2} fill="#4f46e5" />,
        label: 'Library' 
      },
      { 
        path: '/search', 
        icon: <Search size={22} strokeWidth={1.5} color='#fff' />, 
        activeIcon: <Search size={22} strokeWidth={2} fill="#4f46e5" />,
        label: 'Search' 
      },
      { 
        path: '/profile', 
        icon: <User size={22} strokeWidth={1.5} color='#fff' />, 
        activeIcon: <User size={22} strokeWidth={2} fill="#4f46e5" />,
        label: 'Profile' 
      },
    ]

    if (isAuthenticated && user?.role === 'admin') {
      return [
        ...baseItems,
        { 
          path: '/analytics-report', 
          icon: <BarChart2 size={22} strokeWidth={1.5} color='#fff' />, 
          activeIcon: <BarChart2 size={22} strokeWidth={2} fill="#4f46e5" />,
          label: 'Analytics',
          adminOnly: true
        },
        { 
          path: '/content-management', 
          icon: <Book size={22} strokeWidth={1.5} color='#fff' />, 
          activeIcon: <Book size={22} strokeWidth={2} fill="#4f46e5" />,
          label: 'Content',
          adminOnly: true
        },
        { 
          path: '/admin', 
          icon: <BookOpen size={22} strokeWidth={1.5} color='#fff' />, 
          activeIcon: <BookOpen size={22} strokeWidth={2} fill="#4f46e5" />,
          label: 'Admin',
          adminOnly: true
        },
      ]
    }

    return baseItems
  }

  const navItems = getFilteredNavItems()

  // Handle scroll direction for hiding/showing nav on mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > prevScrollY && currentScrollY > 50) {
        setScrollDirection('down')
        if (isVisible) setIsVisible(false)
      } else {
        setScrollDirection('up')
        if (!isVisible) setIsVisible(true)
      }
      setPrevScrollY(currentScrollY)
    }

    // Only add scroll listener on mobile screens
    const isMobile = window.innerWidth < 1024
    if (isMobile) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScrollY, isVisible])

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path
    }
    return pathname.includes(path)
  }

  // Don't render nav if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Render bottom navigation for mobile devices
  const renderBottomNav = () => (
    <nav 
      className={`fixed bottom-0 left-0 right-0 transition-transform duration-300 z-20 lg:hidden
        ${!isVisible ? 'translate-y-full' : 'translate-y-0'} shadow-lg`}
    >
      {/* Premium gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"></div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
      </div>
      
      {/* Navigation items */}
      <div className="relative flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
            href={item.path}
            prefetch={true}
            onMouseEnter={() => import('./MiniPlayer')}
              key={item.path}
              className={`relative group flex flex-col items-center justify-center w-16 h-full transition-all`}
              // onClick={() => router.push(item.path)}
              aria-label={item.label}
            >
              {/* Icon and label container */}
              <div className="flex flex-col items-center">
                {/* Icon with dynamic color based on active state */}
                <div className="relative transition-all">
                  {active ? item.activeIcon : item.icon}
                  
                  {/* Animated indicator dot */}
                  {active && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
                  )}
                </div>
                
                {/* Text label with animation */}
                <span 
                  className={`mt-1 text-xs font-medium transition-all
                    ${active 
                      ? 'text-indigo-600 dark:text-indigo-400 scale-105' 
                      : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300'}`}
                >
                  {item.label}
                </span>
              </div>
              
              {/* Active item indicator line */}
              <div 
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-t-full transition-all duration-300 
                  ${active ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}`}
              ></div>
            </Link>
          )
        })}
      </div>
    </nav>
  )

  // Render sidebar navigation for desktop devices
  const renderSidebar = () => (
    <div className="hidden lg:flex h-screen fixed left-0 top-0 bottom-0 w-64 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-20">
      {/* Brand logo area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
        <BookOpen className="text-indigo-600" size={24} />
        <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">SautiBox</span>
      </div>

      {/* Navigation items */}
      <div className="flex-1 py-6">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <li key={item.path}>
                <Link
            href={item.path}
            prefetch={true}
            onMouseEnter={() => import('./MiniPlayer')}
                  className={`flex items-center w-full px-4 py-3 rounded-lg group transition-all
                    ${active 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  aria-label={item.label}
                >
                  {/* Icon */}
                  <div className="relative transition-all mr-3">
                    {active ? item.activeIcon : item.icon}
                    
                    {/* Indicator dot for active item */}
                    {active && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span 
                    className={`font-medium transition-all ${
                      active ? 'text-indigo-600 dark:text-indigo-400' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                  
                  {/* Active indicator bar */}
                  {active && (
                    <div className="ml-auto w-1 h-6 bg-indigo-600 dark:bg-indigo-500 rounded-full"></div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      
      {/* Bottom section - User profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User size={16} />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role === 'admin' ? 'Administrator' : 'Member'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {renderBottomNav()}
      {renderSidebar()}
      {/* Add padding to main content on desktop to accommodate sidebar */}
      <div className="hidden lg:block w-64"></div>
    </>
  )
}

export default ResponsiveNav