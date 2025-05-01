'use client'
import { Download, TrendingUp, Menu } from "lucide-react";
import { useState } from "react";

export default function AnalyticsReports() {
    const [activeTab, setActiveTab] = useState('usage');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const tabs = ['usage', 'content', 'users', 'revenue'];
    
    return (
      <div className="md:p-3 md:p-6 max-w-full overflow-x-hidden">
        {/* Header - responsive layout */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Analytics & Reports</h1>
          {/* <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md flex items-center justify-center w-full sm:w-auto">
            <Download size={16} className="mr-2" />
            Export Report
          </button> */}
        </div>
        
        {/* Tabs - mobile dropdown vs desktop tabs */}
        <div className="mb-6">
          {/* Mobile tabs dropdown */}
          <div className="block sm:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between p-3 border rounded-md bg-white"
            >
              <span className="font-medium">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analytics</span>
              <Menu size={20} />
            </button>
            
            {mobileMenuOpen && (
              <div className="mt-2 bg-white border rounded-md shadow-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`w-full text-left p-3 ${
                      activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Analytics
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Desktop tabs */}
          <div className="hidden sm:block border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`py-3 px-4 md:py-4 md:px-6 font-medium text-sm whitespace-nowrap border-b-2 ${
                    activeTab === tab 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Analytics
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Analytics content - responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main chart - full width on mobile */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow md:p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {activeTab === 'usage' && 'Listening Activity'}
              {activeTab === 'content' && 'Content Performance'}
              {activeTab === 'users' && 'User Growth'}
              {activeTab === 'revenue' && 'Revenue Trends'}
            </h2>
            <div className="h-64 md:h-80">
              {/* Simulated chart */}
              <div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
                <p className="text-gray-500 text-sm md:text-base text-center px-2">
                  {activeTab === 'usage' && 'Listening activity chart'}
                  {activeTab === 'content' && 'Content performance metrics'}
                  {activeTab === 'users' && 'User growth analytics'}
                  {activeTab === 'revenue' && 'Revenue trends visualization'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Key metrics */}
          <div className="bg-white rounded-lg shadow md:p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h2>
            <div className="space-y-3 md:space-y-4">
              <div className="p-3 md:p-4 border rounded-lg">
                <p className="text-sm font-medium text-gray-500">Active Listeners</p>
                <p className="text-xl md:text-2xl font-bold mt-1">3,842</p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={16} className="text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">+12%</span>
                  <span className="text-xs text-gray-500 ml-1">vs last week</span>
                </div>
              </div>
              
              <div className="p-3 md:p-4 border rounded-lg">
                <p className="text-sm font-medium text-gray-500">Avg. Session Duration</p>
                <p className="text-xl md:text-2xl font-bold mt-1">42 min</p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={16} className="text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">+5%</span>
                  <span className="text-xs text-gray-500 ml-1">vs last week</span>
                </div>
              </div>
              
              <div className="p-3 md:p-4 border rounded-lg">
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-xl md:text-2xl font-bold mt-1">68%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={16} className="text-green-500 mr-1" />
                  <span className="text-sm text-green-500 font-medium">+3%</span>
                  <span className="text-xs text-gray-500 ml-1">vs last week</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Secondary metrics - responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4 md:mt-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <p className="text-sm font-medium text-gray-500">Top Category</p>
            <p className="text-lg md:text-xl font-bold mt-1">Mystery</p>
            <p className="text-sm text-gray-500 mt-1">28% of total listens</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <p className="text-sm font-medium text-gray-500">Peak Listening</p>
            <p className="text-lg md:text-xl font-bold mt-1">8-10 PM</p>
            <p className="text-sm text-gray-500 mt-1">Daily peak hours</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <p className="text-sm font-medium text-gray-500">Device Usage</p>
            <p className="text-lg md:text-xl font-bold mt-1">Mobile</p>
            <p className="text-sm text-gray-500 mt-1">72% of sessions</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <p className="text-sm font-medium text-gray-500">New Users</p>
            <p className="text-lg md:text-xl font-bold mt-1">142</p>
            <p className="text-sm text-gray-500 mt-1">This week</p>
          </div>
        </div>
      </div>
    );
}