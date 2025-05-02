'use client'
import { Download, TrendingUp, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { authApiHelper } from "@/app/utils/api";

interface AnalyticsData {
  date?: string;
  sessions?: number;
  avgDuration?: number;
  bookId?: string;
  title?: string;
  listens?: number;
  avgCompletion?: number;
  week?: string;
  newUsers?: number;
  month?: string;
  revenue?: number;
}

interface KeyMetrics {
  activeListeners?: number;
  listenerGrowth?: number;
  avgSessionDuration?: number;
  durationGrowth?: number;
  completionRate?: number;
  completionGrowth?: number;
}

interface SecondaryMetrics {
  topCategory?: string;
  topCategoryPercentage?: number;
  peakHours?: string;
  topDevice?: string;
  devicePercentage?: number;
  newUsers?: number;
}

export default function AnalyticsReports() {
  const [activeTab, setActiveTab] = useState('usage');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [keyMetrics, setKeyMetrics] = useState<KeyMetrics>({});
  const [secondaryMetrics, setSecondaryMetrics] = useState<SecondaryMetrics>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const tabs = ['usage', 'content', 'users', 'revenue'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch main data based on active tab
        const response = await authApiHelper.get(`/analytics/${activeTab}`);
        if (!response?.ok) throw new Error('Failed to fetch analytics');
        setData(await response.json());

        // Fetch key metrics if not already loaded
        if (!keyMetrics.activeListeners) {
          const metricsResponse = await authApiHelper.get('/analytics/key-metrics');
          if (!metricsResponse?.ok) throw new Error('Failed to fetch key metrics');
          setKeyMetrics(await metricsResponse.json());
        }

        // Fetch secondary metrics if not already loaded
        if (!secondaryMetrics.topCategory) {
          const secondaryResponse = await authApiHelper.get('/analytics/secondary-metrics');
          if (!secondaryResponse?.ok) throw new Error('Failed to fetch secondary metrics');
          setSecondaryMetrics(await secondaryResponse.json());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  if (error) {
    return <div className="p-6 text-red-500">Error loading analytics: {error}</div>;
  }

  return (
    <div className="md:p-3 md:p-6 max-w-full overflow-x-hidden">
      {/* Header - responsive layout */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Analytics & Reports</h1>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md flex items-center justify-center w-full sm:w-auto"
          onClick={() => window.print()}
        >
          <Download size={16} className="mr-2" />
          Export Report
        </button>
      </div>
      
      {/* Tabs */}
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
      
      {/* Analytics content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow md:p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {activeTab === 'usage' && 'Listening Activity'}
            {activeTab === 'content' && 'Content Performance'}
            {activeTab === 'users' && 'User Growth'}
            {activeTab === 'revenue' && 'Revenue Trends'}
          </h2>
          <div className="h-64 md:h-80">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-50 rounded-md flex items-center justify-center">
                {activeTab === 'usage' && (
                  <div className="w-full p-4">
                    {data.map(item => (
                      <div key={item.date} className="mb-2">
                        <div className="flex justify-between">
                          <span>{item.date}</span>
                          <span>{item.sessions} sessions ({Math.round(item.avgDuration || 0)} min avg)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(100, (item.sessions || 0) / 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'content' && (
                  <div className="w-full p-4">
                    {data.map(item => (
                      <div key={item.bookId} className="mb-2">
                        <div className="font-medium">{item.title}</div>
                        <div className="flex justify-between text-sm">
                          <span>{item.listens} listens</span>
                          <span>{Math.round((item.avgCompletion || 0) * 100)}% completion</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'users' && (
                  <div className="w-full p-4">
                    {data.map(item => (
                      <div key={item.week} className="mb-2">
                        <div className="flex justify-between">
                          <span>Week {item.week}</span>
                          <span>{item.newUsers} new users</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(100, (item.newUsers || 0) / 10)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'revenue' && (
                  <div className="w-full p-4">
                    {data.map(item => (
                      <div key={item.month} className="mb-2">
                        <div className="flex justify-between">
                          <span>{item.month}</span>
                          <span>${(item.revenue || 0).toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(100, (item.revenue || 0) / 1000)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Key metrics */}
        <div className="bg-white rounded-lg shadow md:p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h2>
          <div className="space-y-3 md:space-y-4">
            <div className="p-3 md:p-4 border rounded-lg">
              <p className="text-sm font-medium text-gray-500">Active Listeners</p>
              <p className="text-xl md:text-2xl font-bold mt-1">
                {loading ? 'Loading...' : keyMetrics.activeListeners?.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-green-500 font-medium">
                  {keyMetrics.listenerGrowth || 0}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last week</span>
              </div>
            </div>
            
            <div className="p-3 md:p-4 border rounded-lg">
              <p className="text-sm font-medium text-gray-500">Avg. Session Duration</p>
              <p className="text-xl md:text-2xl font-bold mt-1">
                {loading ? 'Loading...' : keyMetrics.avgSessionDuration ? `${Math.round(keyMetrics.avgSessionDuration / 60)} min` : 'N/A'}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-green-500 font-medium">
                  {keyMetrics.durationGrowth || 0}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last week</span>
              </div>
            </div>
            
            <div className="p-3 md:p-4 border rounded-lg">
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-xl md:text-2xl font-bold mt-1">
                {loading ? 'Loading...' : keyMetrics.completionRate ? `${Math.round(keyMetrics.completionRate * 100)}%` : 'N/A'}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-green-500 font-medium">
                  {keyMetrics.completionGrowth || 0}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4 md:mt-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <p className="text-sm font-medium text-gray-500">Top Category</p>
          <p className="text-lg md:text-xl font-bold mt-1">
            {loading ? 'Loading...' : secondaryMetrics.topCategory}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {secondaryMetrics.topCategoryPercentage ? `${secondaryMetrics.topCategoryPercentage}% of total listens` : ''}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <p className="text-sm font-medium text-gray-500">Peak Listening</p>
          <p className="text-lg md:text-xl font-bold mt-1">
            {loading ? 'Loading...' : secondaryMetrics.peakHours}
          </p>
          <p className="text-sm text-gray-500 mt-1">Daily peak hours</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <p className="text-sm font-medium text-gray-500">Device Usage</p>
          <p className="text-lg md:text-xl font-bold mt-1">
            {loading ? 'Loading...' : secondaryMetrics.topDevice}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {secondaryMetrics.devicePercentage ? `${secondaryMetrics.devicePercentage}% of sessions` : ''}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <p className="text-sm font-medium text-gray-500">New Users</p>
          <p className="text-lg md:text-xl font-bold mt-1">
            {loading ? 'Loading...' : secondaryMetrics.newUsers}
          </p>
          <p className="text-sm text-gray-500 mt-1">This week</p>
        </div>
      </div>
    </div>
  );
}