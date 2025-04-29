
import { Home, User, BookOpen, Library,Settings, Clock, Bookmark, X } from 'lucide-react';
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";


  interface SidebarProps {
    showSidebar: boolean;
    setShowSidebar: (value: boolean) => void;
  }

  const Sidebar = ({ showSidebar, setShowSidebar }: SidebarProps) => {
    const pathname = usePathname()
          const router = useRouter()
    return (
    
    <aside className={`
      fixed top-0 bottom-0 left-0 bg-white border-r p-4 w-64 z-20 
      transform transition-transform duration-300 
      ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0 lg:static
    `}>
      <div className="flex items-center gap-2 mb-8">
        <BookOpen className="text-blue-500" size={24} />
        <h1 className="text-lg font-bold">AudioBookify</h1>
        <button 
          className="ml-auto lg:hidden"
          onClick={() => setShowSidebar(false)}
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className="space-y-1">
        <button 
          className={`flex items-center gap-3 p-3 w-full rounded-lg ${pathname === 'home' ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'}`}
          onClick={() => {
            router.push('home');
            setShowSidebar(false);
          }}
        >
          <Home size={20} />
          <span>Home</span>
        </button>
        <button 
          className={`flex items-center gap-3 p-3 w-full rounded-lg ${pathname === 'library' ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'}`}
          onClick={() => {
            router.push('library');
            setShowSidebar(false);
          }}
        >
          <Library size={20} />
          <span>My Library</span>
        </button>
        <button 
          className={`flex items-center gap-3 p-3 w-full rounded-lg ${pathname === 'profile' ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-100'}`}
          onClick={() => {
            router.push('profile');
            setShowSidebar(false);
          }}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>
      
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Your Collections</h3>
        <div className="space-y-1">
          <button className="flex items-center gap-3 p-2 w-full hover:bg-gray-100 rounded-lg">
            <Bookmark size={16} />
            <span>Favorites</span>
          </button>
          <button className="flex items-center gap-3 p-2 w-full hover:bg-gray-100 rounded-lg">
            <Clock size={16} />
            <span>Recently Played</span>
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 right-4">
        <button 
          className="flex items-center gap-2 p-3 text-blue-500 w-full justify-center border border-blue-500 rounded-lg"
          onClick={() => router.push('admin')}
        >
          <Settings size={16} />
          <span>Admin Dashboard</span>
        </button>
      </div>
    </aside>
  )};

  export default Sidebar