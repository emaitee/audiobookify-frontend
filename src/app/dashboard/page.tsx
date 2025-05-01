'use client'
import { AlertTriangle, BarChart2, Book, ChevronRight, DollarSign, Download, Edit, Eye, Filter, Megaphone, Plus, Search, Trash2, TrendingUp, User, Users, X } from "lucide-react";
import { useState } from "react";

import { 
  Home, 
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Headphones,
  BookOpen,
  Clock,
  Menu,
  FileText,
  Calendar,
  UploadCloud,
  ArrowRight, Settings as SettingsIcon,
  Star,
} from 'lucide-react';
import AnalyticsReports from "@/components/dashboard-contents/AnalyticsReport";
import ContentManagement from "@/components/dashboard-contents/ContentManagement";

export default function AudiobookAdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <Home size={20} /> },
    { id: 'content', name: 'Content Management', icon: <Book size={20} /> },
    { id: 'users', name: 'User Management', icon: <Users size={20} /> },
    { id: 'sales', name: 'Sales & Revenue', icon: <DollarSign size={20} /> },
    { id: 'analytics', name: 'Analytics & Reports', icon: <BarChart2 size={20} /> },
    { id: 'marketing', name: 'Marketing', icon: <Megaphone size={20} /> },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon size={20} /> },
  ];

  // Content for different tabs
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'content':
        return <ContentManagement />;
      case 'users':
        return <UserManagement />;
      case 'sales':
        return <SalesRevenue />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'marketing':
        return <Marketing />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white ${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 flex flex-col transition-all duration-300`}>
        <div className="flex items-center justify-between h-16 border-b border-gray-800 px-4">
          {sidebarOpen && (
            <>
              <div className="flex items-center">
                <Headphones size={24} className="text-blue-400 mr-2" />
                <span className="text-xl font-bold">AudioBook</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <ChevronRight size={20} />
              </button>
            </>
          )}
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="mx-auto text-gray-400 hover:text-white">
              <Menu size={24} />
            </button>
          )}
        </div>
        
        <div className="flex-grow overflow-y-auto">
          <nav className="mt-5 px-2">
            {menuItems.map((item) => (
              <a 
                key={item.id}
                href="#"
                className={`flex items-center px-4 py-3 mt-1 rounded-md transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                {sidebarOpen && <span>{item.name}</span>}
              </a>
            ))}
          </nav>
        </div>
        
        {/* User info at bottom */}
        <div className={`p-4 border-t border-gray-800 flex ${sidebarOpen ? 'items-center' : 'flex-col items-center'}`}>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
            <span className="text-white font-semibold">JD</span>
          </div>
          {sidebarOpen && (
            <>
              <div className="flex-grow">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
              <button className="text-gray-400 hover:text-white">
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="flex items-center rounded-md border border-gray-300 bg-gray-50 px-3 py-2 w-64">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none text-sm flex-grow"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-400 hover:bg-gray-100 relative mr-2">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>
            
            <button className="p-2 rounded-full text-gray-400 hover:bg-gray-100 mr-2">
              <HelpCircle size={20} />
            </button>
            
            <div className="flex items-center cursor-pointer ml-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                JD
              </div>
              <span className="ml-2 text-sm font-medium">John Doe</span>
              <ChevronDown size={16} className="ml-1 text-gray-500" />
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Dashboard Overview Component
function DashboardContent() {
  // Mock data for the dashboard
  const topAudiobooks = [
    { id: 1, title: "The Silent Echo", author: "Maria Jenkins", listens: 14532, completion: 78 },
    { id: 2, title: "Darkness Falls", author: "James Peterson", listens: 12845, completion: 81 },
    { id: 3, title: "Eternal Skies", author: "Leila Ahmad", listens: 9876, completion: 92 },
    { id: 4, title: "The Last Journey", author: "Robert Chen", listens: 8754, completion: 65 },
  ];

  const recentUsers = [
    { id: 1, name: "Alex Morgan", plan: "Premium", joined: "2 days ago" },
    { id: 2, name: "Sarah Wilson", plan: "Standard", joined: "5 days ago" },
    { id: 3, name: "David Kim", plan: "Premium", joined: "1 week ago" },
  ];

  const statCards = [
    { title: "Total Listens", value: "182.4K", trend: "+12%", icon: <Headphones size={20} /> },
    { title: "Active Subscribers", value: "8,942", trend: "+8%", icon: <Users size={20} /> },
    { title: "Library Size", value: "3,721", trend: "+24", icon: <BookOpen size={20} /> },
    { title: "Avg. Listen Time", value: "42min", trend: "+5%", icon: <Clock size={20} /> },
  ];

  const alerts = [
    { id: 1, type: "warning", message: "Server load high - consider optimization" },
    { id: 2, type: "info", message: "15 new user registrations in the last hour" },
    { id: 3, type: "error", message: "Payment gateway timeout detected at 14:25" },
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex">
          <button className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 mr-2 hover:bg-gray-50">
            Export
          </button>
          <button className="bg-blue-500 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-600">
            Add New Content
          </button>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`rounded-full p-2 ${index % 2 === 0 ? 'bg-blue-100 text-blue-500' : 'bg-purple-100 text-purple-500'}`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">{stat.trend}</span>
              <span className="text-xs text-gray-500 ml-1">vs last period</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Audiobooks */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Top Performing Audiobooks</h2>
            <button className="text-sm text-blue-500 hover:text-blue-700">See All</button>
          </div>
          <div className="p-4">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Author</th>
                  <th className="px-4 py-2">Listens</th>
                  <th className="px-4 py-2">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topAudiobooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-gray-200 mr-3 flex items-center justify-center">
                          <Book size={14} className="text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{book.author}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{book.listens.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              book.completion > 80 ? 'bg-green-500' : 
                              book.completion > 60 ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${book.completion}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{book.completion}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Users & Alerts */}
        <div className="space-y-6">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Recent Users</h2>
              <button className="text-sm text-blue-500 hover:text-blue-700">View All</button>
            </div>
            <div className="p-4">
              <ul className="divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <li key={user.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <User size={14} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">Joined {user.joined}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.plan === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.plan}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* System Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 p-4">
              <h2 className="font-semibold text-gray-800">System Alerts</h2>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                {alerts.map((alert) => (
                  <li 
                    key={alert.id} 
                    className={`p-3 rounded-md ${
                      alert.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                      alert.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
                      'bg-blue-50 border-l-4 border-blue-500'
                    }`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle size={16} className={
                          alert.type === 'warning' ? 'text-yellow-400' :
                          alert.type === 'error' ? 'text-red-500' :
                          'text-blue-500'
                        } />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">{alert.message}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly User Growth</h2>
          <div className="h-64 flex items-end space-x-2">
            {/* Simulated bar chart with Tailwind */}
            <div className="flex-1 flex items-end justify-around">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                // Generate heights for demo
                const heights = ['h-1/4', 'h-2/5', 'h-1/2', 'h-3/5', 'h-3/4', 'h-4/5'];
                const height = heights[index];
                
                return (
                  <div key={month} className="flex flex-col items-center">
                    <div className={`w-12 ${height} bg-blue-400 rounded-t-md hover:bg-blue-600 transition-colors`}></div>
                    <span className="text-xs text-gray-500 mt-2">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-end">
            {/* Simulated line chart with Tailwind */}
            <div className="w-full h-full relative flex items-end">
              <div className="absolute inset-0 grid grid-cols-1 grid-rows-4">
                <div className="border-b border-gray-200"></div>
                <div className="border-b border-gray-200"></div>
                <div className="border-b border-gray-200"></div>
                <div className="border-b border-gray-200"></div>
              </div>
              
              <div className="w-full flex items-end">
                <div className="w-full flex items-end space-x-6 px-4">
                  <div className="w-full flex justify-between relative">
                    {/* Line chart points */}
                    <div className="absolute left-0 bottom-0 border-b-2 border-blue-500 w-full h-1/2" style={{ clipPath: 'polygon(0% 100%, 20% 40%, 40% 75%, 60% 30%, 80% 50%, 100% 10%, 100% 100%)' }}></div>
                    
                    {/* Data points */}
                    <div className="w-2 h-2 bg-blue-500 rounded-full relative z-10" style={{ marginBottom: '50%' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full relative z-10" style={{ marginBottom: '40%' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full relative z-10" style={{ marginBottom: '75%' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full relative z-10" style={{ marginBottom: '30%' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full relative z-10" style={{ marginBottom: '50%' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full relative z-10" style={{ marginBottom: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content Management Component

        
// User Management Component
function UserManagement() {
    const [activeView, setActiveView] = useState('all');
    
    const users = [
      { id: 1, name: "Alex Morgan", email: "alex@example.com", plan: "Premium", status: "Active", joined: "2023-05-15", lastActive: "2 hours ago" },
      { id: 2, name: "Sarah Wilson", email: "sarah@example.com", plan: "Standard", status: "Active", joined: "2023-06-22", lastActive: "1 day ago" },
      { id: 3, name: "David Kim", email: "david@example.com", plan: "Premium", status: "Suspended", joined: "2023-04-10", lastActive: "1 week ago" },
      { id: 4, name: "Emma Johnson", email: "emma@example.com", plan: "Free", status: "Active", joined: "2023-07-05", lastActive: "30 minutes ago" },
      { id: 5, name: "Michael Brown", email: "michael@example.com", plan: "Standard", status: "Inactive", joined: "2023-03-18", lastActive: "1 month ago" },
    ];
  
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <Plus size={16} className="mr-2" />
            Add New User
          </button>
        </div>
        
        {/* View tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['all', 'active', 'inactive', 'suspended'].map((view) => (
                <button
                  key={view}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeView === view 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveView(view)}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Filters and search */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 w-64">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="bg-transparent border-none focus:outline-none text-sm flex-grow"
                />
              </div>
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                <Filter size={16} className="mr-1" />
                <span className="text-sm">Filter</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center bg-white border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                <Download size={16} className="mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Users table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users
                .filter(user => activeView === 'all' || user.status.toLowerCase().includes(activeView))
                .map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                          <User size={16} className="text-gray-500" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.plan === 'Premium' ? 'bg-purple-100 text-purple-800' : 
                        user.plan === 'Standard' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        user.status === 'Suspended' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Eye size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                  <span className="font-medium">5</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    disabled
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronRight size={16} className="transform rotate-180" />
                  </button>
                  <button
                    aria-current="page"
                    className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </button>
                  <button
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    2
                  </button>
                  <button
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    3
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Sales & Revenue Component
  function SalesRevenue() {
    const [timeRange, setTimeRange] = useState('monthly');
    
    const salesData = [
      { id: 1, date: "2023-07-01", user: "Alex Morgan", product: "Premium Subscription", amount: "$9.99", status: "Completed" },
      { id: 2, date: "2023-07-03", user: "Sarah Wilson", product: "Standard Subscription", amount: "$4.99", status: "Completed" },
      { id: 3, date: "2023-07-05", user: "David Kim", product: "Audiobook Purchase", amount: "$14.99", status: "Refunded" },
      { id: 4, date: "2023-07-08", user: "Emma Johnson", product: "Premium Subscription", amount: "$9.99", status: "Completed" },
      { id: 5, date: "2023-07-10", user: "Michael Brown", product: "Standard Subscription", amount: "$4.99", status: "Pending" },
    ];
    
    const revenueStats = [
      { title: "Total Revenue", value: "$1,245.67", trend: "+12%", icon: <DollarSign size={20} /> },
      { title: "New Subscriptions", value: "48", trend: "+8%", icon: <Users size={20} /> },
      { title: "Audiobook Sales", value: "23", trend: "+15%", icon: <Book size={20} /> },
      { title: "Avg. Order Value", value: "$8.42", trend: "+5%", icon: <BarChart2 size={20} /> },
    ];
  
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sales & Revenue</h1>
          <div className="flex items-center space-x-2">
            <button 
              className={`px-3 py-1 rounded-md text-sm ${timeRange === 'weekly' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setTimeRange('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${timeRange === 'monthly' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${timeRange === 'yearly' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setTimeRange('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
        
        {/* Revenue stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {revenueStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`rounded-full p-2 ${index % 2 === 0 ? 'bg-blue-100 text-blue-500' : 'bg-purple-100 text-purple-500'}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-green-500 font-medium">{stat.trend}</span>
                <span className="text-xs text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Revenue chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h2>
          <div className="h-64">
            {/* Simulated chart */}
            <div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Revenue chart for {timeRange} data</p>
            </div>
          </div>
        </div>
        
        {/* Recent transactions */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Recent Transactions</h2>
            <button className="text-sm text-blue-500 hover:text-blue-700">View All</button>
          </div>
          <div className="p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesData.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{sale.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sale.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        sale.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  
  // Analytics & Reports Component

  
  // Marketing Component
  function Marketing() {
    const [activeTab, setActiveTab] = useState('campaigns');
    
    const campaigns = [
      { id: 1, name: "Summer Sale", status: "Active", startDate: "2023-06-01", endDate: "2023-08-31", budget: "$5,000", clicks: "1,245", conversions: "142" },
      { id: 2, name: "New User Discount", status: "Completed", startDate: "2023-05-01", endDate: "2023-05-31", budget: "$2,500", clicks: "842", conversions: "98" },
      { id: 3, name: "Holiday Special", status: "Draft", startDate: "2023-11-15", endDate: "2023-12-31", budget: "$7,500", clicks: "-", conversions: "-" },
    ];
    
    const promotions = [
      { id: 1, name: "Premium 30% Off", code: "PREMIUM30", type: "Discount", uses: "142/500", status: "Active" },
      { id: 2, name: "Free Trial", code: "FREETRIAL", type: "Trial", uses: "Unlimited", status: "Active" },
      { id: 3, name: "Referral Bonus", code: "REFER10", type: "Credit", uses: "23/100", status: "Active" },
    ];
  
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Marketing</h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
            <Plus size={16} className="mr-2" />
            Create Campaign
          </button>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['campaigns', 'promotions', 'emails', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === tab 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Content */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Marketing Campaigns</h2>
              <button className="text-sm text-blue-500 hover:text-blue-700">View All</button>
            </div>
            <div className="p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Dates</th>
                    <th className="px-6 py-3">Budget</th>
                    <th className="px-6 py-3">Clicks</th>
                    <th className="px-6 py-3">Conversions</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          campaign.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.startDate} to {campaign.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{campaign.budget}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.clicks}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.conversions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'promotions' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Promotions & Discounts</h2>
              <button className="text-sm text-blue-500 hover:text-blue-700">Create New</button>
            </div>
            <div className="p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Code</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Uses</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {promotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{promo.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{promo.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{promo.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{promo.uses}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          promo.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {promo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'emails' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Email Campaigns</h2>
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Megaphone size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No email campaigns yet</h3>
              <p className="text-gray-500 mb-6">Create your first email campaign to engage with your audience</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md inline-flex items-center">
                <Plus size={16} className="mr-2" />
                Create Email Campaign
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Marketing Analytics</h2>
            <div className="h-96 bg-gray-50 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Marketing performance analytics and metrics</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Settings Component
  function Settings() {
    const [activeTab, setActiveTab] = useState('general');
    
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['general', 'users', 'content', 'billing', 'api'].map((tab) => (
                <button
                  key={tab}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === tab 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'general' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">General Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Application Name</label>
                    <p className="text-xs text-gray-500 mt-1">This will be displayed throughout the platform</p>
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      defaultValue="Audiobook Admin"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Timezone</label>
                    <p className="text-xs text-gray-500 mt-1">Set the default timezone for reporting</p>
                  </div>
                  <div className="md:col-span-2">
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="UTC"
                    >
                      <option>UTC</option>
                      <option>EST</option>
                      <option>PST</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Logo</label>
                    <p className="text-xs text-gray-500 mt-1">Recommended size: 200x50px</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <div className="w-20 h-10 rounded bg-gray-200 flex items-center justify-center mr-4">
                        <span className="text-xs text-gray-500">Logo</span>
                      </div>
                      <button className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                        Change
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">User Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">User Registration</label>
                    <p className="text-xs text-gray-500 mt-1">Allow new users to register</p>
                  </div>
                  <div className="md:col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Enable public registration</label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Default User Role</label>
                    <p className="text-xs text-gray-500 mt-1">Role assigned to new registrations</p>
                  </div>
                  <div className="md:col-span-2">
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue="user"
                    >
                      <option>Admin</option>
                      <option>Editor</option>
                      <option>User</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'content' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Content Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Content Approval</label>
                    <p className="text-xs text-gray-500 mt-1">Require approval before publishing</p>
                  </div>
                  <div className="md:col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Enable content review workflow</label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Default Categories</label>
                    <p className="text-xs text-gray-500 mt-1">Add or remove content categories</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {['Fiction', 'Mystery', 'Science Fiction', 'Self-help', 'History'].map((category) => (
                        <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {category}
                          <button type="button" className="ml-1.5 inline-flex text-blue-500 hover:text-blue-700">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      <button className="inline-flex items-center px-2 py-0.5 border border-gray-300 rounded-full text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Plus size={12} className="mr-1" />
                        Add Category
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'billing' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Billing & Subscription</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <DollarSign size={20} className="text-blue-500" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-blue-800">Premium Plan</h3>
                    <p className="text-sm text-blue-700 mt-1">Your next billing date is August 15, 2023</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <p className="text-xs text-gray-500 mt-1">Update your credit card information</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between bg-white border border-gray-300 rounded-md p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-xs font-medium">VISA</span>
                        </div>
                        <span className="text-sm font-medium">•••• •••• •••• 4242</span>
                      </div>
                      <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                        Update
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Billing Email</label>
                    <p className="text-xs text-gray-500 mt-1">Where invoices will be sent</p>
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="email"
                      defaultValue="admin@audiobook.com"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    Update Billing
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'api' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">API Access</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle size={20} className="text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">API Access is currently disabled</h3>
                    <p className="text-sm text-yellow-700 mt-1">Enable API access to allow external applications to connect to your platform.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">API Status</label>
                    <p className="text-xs text-gray-500 mt-1">Enable or disable API access</p>
                  </div>
                  <div className="md:col-span-2 flex items-center">
                    <button
                      type="button"
                      className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="sr-only">Enable API</span>
                      <span
                        aria-hidden="true"
                        className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      ></span>
                    </button>
                    <label className="ml-2 block text-sm text-gray-700">Enable API access</label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">API Keys</label>
                    <p className="text-xs text-gray-500 mt-1">Manage your API access keys</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="bg-white border border-gray-300 rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">No API keys generated</span>
                        <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                          Generate Key
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    Save API Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }