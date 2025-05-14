'use client'
import { Book } from '@/app/[locale]/page-old';
import { formatTime } from '@/app/utils/helpers';
import { Bookmark, ChevronLeft, ChevronRight, Clock, Play, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react'

function FeaturedBooks({ featuredBooks, handlePlay }: { featuredBooks: Array<Book>, handlePlay: (book: any) => void }) {
    const t = useTranslations('HomePage')
    const { theme } = useTheme()
    const carouselRef = useRef<HTMLDivElement>(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [slidesToShow, setSlidesToShow] = useState(1)
    const [isPaused, setIsPaused] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout>(null)

    // Determine how many slides to show based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSlidesToShow(2)
            } else {
                setSlidesToShow(1)
            }
            // Recalculate current slide to prevent empty space
            const newCurrentSlide = Math.floor(currentSlide * slidesToShow / (window.innerWidth >= 768 ? 2 : 1))
            setCurrentSlide(newCurrentSlide)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [currentSlide])

    // Auto-scroll carousel with pause on hover/interaction
    useEffect(() => {
        if (featuredBooks.length <= slidesToShow || isPaused) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            return
        }

        const startAutoScroll = () => {
            intervalRef.current = setInterval(() => {
                const nextSlide = (currentSlide + 1) % Math.ceil(featuredBooks.length / slidesToShow)
                scrollToSlide(nextSlide)
            }, 5000) // Change slide every 5 seconds
        }

        startAutoScroll()
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [currentSlide, featuredBooks.length, slidesToShow, isPaused])

    const scrollToSlide = (slideIndex: number) => {
        if (!carouselRef.current) return
        
        const slideWidth = carouselRef.current.clientWidth / slidesToShow
        carouselRef.current.scrollTo({
            left: slideWidth * slideIndex * slidesToShow,
            behavior: 'smooth'
        })
        setCurrentSlide(slideIndex)
    }

    const handlePrev = () => {
        const prevSlide = (currentSlide - 1 + Math.ceil(featuredBooks.length / slidesToShow)) % Math.ceil(featuredBooks.length / slidesToShow)
        scrollToSlide(prevSlide)
        setIsPaused(true)
        setTimeout(() => setIsPaused(false), 10000) // Resume after 10 seconds
    }

    const handleNext = () => {
        const nextSlide = (currentSlide + 1) % Math.ceil(featuredBooks.length / slidesToShow)
        scrollToSlide(nextSlide)
        setIsPaused(true)
        setTimeout(() => setIsPaused(false), 10000) // Resume after 10 seconds
    }

    // Handle touch events for mobile swipe
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            // Swipe left
            handleNext()
        }

        if (touchStart - touchEnd < -50) {
            // Swipe right
            handlePrev()
        }
    }

    return (
        <section className="pb-4 px-0 md:px-4">
            {featuredBooks?.length > 0 && (
                <div className="relative">
                    {/* Compact Header with Integrated Navigation */}
                    <div className="md:px-6 mb-3 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
                            } mr-2`}>
                                <Star size={12} className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'} fill="currentColor" />
                            </div>
                            <h2 className="text-base md:text-lg font-bold">{t('featured.sectionTitle') || 'Featured Books'}</h2>
                        </div>
                        
                        {/* Navigation Controls */}
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.ceil(featuredBooks.length / slidesToShow) }).map((_, index) => (
                                <button 
                                    key={index}
                                    onClick={() => {
                                        scrollToSlide(index)
                                        setIsPaused(true)
                                        setTimeout(() => setIsPaused(false), 10000)
                                    }}
                                    aria-label={`Go to slide ${index + 1}`}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                        index === currentSlide 
                                            ? `w-4 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'}` 
                                            : `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {/* Carousel Container */}
                    <div 
                        ref={carouselRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full hide-scrollbar"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {featuredBooks.map((book) => (
                            <div 
                                key={book._id} 
                                className="flex-none snap-center snap-always"
                                style={{
                                    width: `${100 / slidesToShow}%`,
                                    minWidth: `${100 / slidesToShow}%`,
                                    paddingRight: '0.5rem',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <div className={`
                                    rounded-xl overflow-hidden shadow-lg h-36 md:h-40 lg:h-48 
                                    ${theme === 'dark' ? 'bg-gray-900 shadow-purple-900/20' : 'bg-white shadow-blue-600/20'}
                                    transition-transform duration-300 hover:scale-[1.01] hover:shadow-lg
                                `}>
                                    <div className="flex h-full">
                                        {/* Left Side - Book Cover */}
                                        <div className="relative w-22 md:w-28 lg:w-32 flex-shrink-0 group">
                                            {/* Background Gradient */}
                                            <div className={`absolute inset-0 ${
                                                theme === 'dark'
                                                    ? 'bg-gradient-to-r from-purple-900/80 to-blue-900/40'
                                                    : 'bg-gradient-to-r from-purple-600/70 to-blue-600/30'
                                            }`}></div>
                                            
                                            {/* Book Cover */}
                                            <img 
                                                src={book.coverImage} 
                                                alt={book.title} 
                                                className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-40 transition-opacity duration-300 group-hover:opacity-30"
                                            />
                                            
                                            {/* Actual Book Cover with hover effect */}
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:-translate-y-[52%]">
                                                <div className="relative h-24 md:h-28 w-16 md:w-20 rounded-md overflow-hidden shadow-lg">
                                                    <img 
                                                        src={book.coverImage} 
                                                        alt={book.title} 
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Right Side - Content */}
                                        <div className="flex-1 w-22 p-3 md:p-4 flex flex-col justify-between overflow-hidden">
                                            {/* Top Content Area */}
                                            <div>
                                                {/* Featured Tag and Category in One Line */}
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className={`
                                                        text-[10px] px-1.5 py-0.5 rounded-full font-medium
                                                        ${theme === 'dark' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}
                                                    `}>
                                                        {t('featured.label')}
                                                    </span>
                                                    
                                                    <span className={`
                                                        text-[10px] px-1.5 py-0.5 rounded-full
                                                        ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}
                                                    `}>
                                                        {book.category || 'Audiobook'}
                                                    </span>
                                                </div>
                                                
                                                {/* Book Title - Limited to 2 Lines */}
                                                <h3 className="text-sm md:text-base font-bold line-clamp-2 mb-0.5">{book.title}</h3>
                                                
                                                {/* Author - Single Line */}
                                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} line-clamp-1`}>
                                                    By {book.author.name}
                                                </p>
                                            </div>
                                            
                                            {/* Bottom Action Area */}
                                            <div className="flex items-center justify-between pt-1 mt-auto">
                                                {/* Stats in Small Text */}
                                                <div className={`flex items-center text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    <Clock size={10} className="mr-1" />
                                                    <span>{formatTime(book.duration)}</span>
                                                    <span className="mx-1.5">•</span>
                                                    <div className="flex items-center">
                                                        <Star size={10} fill="currentColor" className="text-amber-400 mr-1" />
                                                        <span>4.0</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Action Buttons */}
                                                <div className="flex items-center space-x-2">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handlePlay(book)
                                                        }}
                                                        className={`
                                                            h-8 w-8 rounded-full shadow-md flex items-center justify-center
                                                            ${theme === 'dark' 
                                                                ? 'bg-purple-600 hover:bg-purple-500 text-white' 
                                                                : 'bg-purple-600 hover:bg-purple-500 text-white'
                                                            }
                                                            transition-transform duration-200 hover:scale-110
                                                        `}
                                                        aria-label={`Play ${book.title}`}
                                                    >
                                                        <Play size={14} fill="currentColor" stroke="none" className="ml-0.5" />
                                                    </button>
                                                    
                                                    <button 
                                                        className={`
                                                            h-8 w-8 rounded-full flex items-center justify-center
                                                            ${theme === 'dark' 
                                                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                            }
                                                            transition-transform duration-200 hover:scale-110
                                                        `}
                                                        aria-label={`Bookmark ${book.title}`}
                                                    >
                                                        <Bookmark size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Navigation Arrows - Only show if there are more items than currently visible */}
                    {featuredBooks.length > slidesToShow && (
                        <div className="hidden md:block">
                            <button 
                                className={`
                                    absolute top-1/2 left-0 transform -translate-y-1/2 z-10
                                    w-8 h-8 rounded-full shadow-md flex items-center justify-center
                                    ${theme === 'dark' 
                                        ? 'bg-gray-800/80 hover:bg-gray-700 text-white' 
                                        : 'bg-white/80 hover:bg-gray-100 text-gray-800'
                                    }
                                    transition-all duration-300 -ml-2 hover:ml-0
                                `}
                                onClick={handlePrev}
                                aria-label="Previous featured book"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            
                            <button 
                                className={`
                                    absolute top-1/2 right-0 transform -translate-y-1/2 z-10
                                    w-8 h-8 rounded-full shadow-md flex items-center justify-center
                                    ${theme === 'dark' 
                                        ? 'bg-gray-800/80 hover:bg-gray-700 text-white' 
                                        : 'bg-white/80 hover:bg-gray-100 text-gray-800'
                                    }
                                    transition-all duration-300 -mr-2 hover:mr-0
                                `}
                                onClick={handleNext}
                                aria-label="Next featured book"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    )
}

export default FeaturedBooks
