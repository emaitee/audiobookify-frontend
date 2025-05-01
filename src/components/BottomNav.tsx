import React from 'react'
import { Search, Home, User, BookOpen, Library } from 'lucide-react';
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

function BottomNav() {
    const pathname = usePathname()
      const router = useRouter()

  return (
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-10 lg:hidden">
      <button 
        className={`p-2 flex flex-col items-center ${pathname === 'home' ? 'text-blue-500' : 'text-gray-500'}`}
        onClick={() =>  router.push('/')}
      >
        <Home size={20} />
        <span className="text-xs mt-1">Home</span>
      </button>
      <button 
        className={`p-2 flex flex-col items-center ${pathname === 'library' ? 'text-blue-500' : 'text-gray-500'}`}
        onClick={() =>  router.push('/library')}
      >
        <Library size={20} />
        <span className="text-xs mt-1">Library</span>
      </button>
      <button 
        className={`p-2 flex flex-col items-center ${pathname === 'search' ? 'text-blue-500' : 'text-gray-500'}`}
        onClick={() =>  router.push('/search')}
      >
        <Search size={20} />
        <span className="text-xs mt-1">Search</span>
      </button>
      <button 
        className={`p-2 flex flex-col items-center ${pathname === 'profile' ? 'text-blue-500' : 'text-gray-500'}`}
        onClick={() =>  router.push('/profile')}
      >
        <User size={20} />
        <span className="text-xs mt-1">Profile</span>
      </button>
      <button 
        className={`p-2 flex flex-col items-center ${pathname === 'admin' ? 'text-blue-500' : 'text-gray-500'}`}
        onClick={() =>  router.push('/admin')}
      >
        <BookOpen size={20} />
        <span className="text-xs mt-1">Admin</span>
      </button>
    </nav>
  )
}

export default BottomNav