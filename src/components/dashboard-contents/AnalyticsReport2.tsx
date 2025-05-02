// 'use client'
// import { Download, TrendingUp, Menu } from "lucide-react";
// import { useState, useEffect } from "react";
// import { authApiHelper } from "@/app/utils/api";
// import { 
//   LineChart, Line, BarChart, Bar, PieChart, Pie, 
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
//   ResponsiveContainer, Cell, AreaChart, Area
// } from "recharts";

// interface AnalyticsData {
//   date?: string;
//   sessions?: number;
//   avgDuration?: number;
//   bookId?: string;
//   title?: string;
//   listens?: number;
//   avgCompletion?: number;
//   week?: string;
//   newUsers?: number;
//   month?: string;
//   revenue?: number;
// }

// interface KeyMetrics {
//   activeListeners?: number;
//   listenerGrowth?: number;
//   avgSessionDuration?: number;
//   durationGrowth?: number;
//   completionRate?: number;
//   completionGrowth?: number;
// }

// interface SecondaryMetrics {
//   topCategory?: string;
//   topCategoryPercentage?: number;
//   peakHours?: string;
//   topDevice?: string;
//   devicePercentage?: number;
//   newUsers?: number;
//   // Additional data for charts
//   categoryData?: Array<{name: string, value: number}>;
//   deviceData?: Array<{name: string, value: number}>;
//   hourlyData?: Array<{hour: string, sessions: number}>;
// }

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// export default function AnalyticsReports() {
//   const [activeTab, setActiveTab] = useState('usage');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [data, setData] = useState<AnalyticsData[]>([]);
//   const [keyMetrics, setKeyMetrics] = useState<KeyMetrics>({});
//   const [secondaryMetrics, setSecondaryMetrics] = useState<SecondaryMetrics>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   const tabs = ['usage', 'content', 'users', 'revenue'];

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // Fetch main data based on active tab
//         const response = await authApiHelper.get(`/analytics/${activeTab}`);
//         if (!response?.ok) throw new Error('Failed to fetch analytics');
//         setData(await response.json());

//         // Fetch key metrics if not already loaded
//         if (!keyMetrics.activeListeners) {
//           const metricsResponse = await authApiHelper.get('/analytics/key-metrics');
//           if (!metricsResponse?.ok) throw new Error('Failed to fetch key metrics');
//           setKeyMetrics(await metricsResponse.json());
//         }

//         // Fetch secondary metrics if not already loaded
//         if (!secondaryMetrics.topCategory) {
//           const secondaryResponse = await authApiHelper.get('/analytics/secondary-metrics');
//           if (!secondaryResponse?.ok) throw new Error('Failed to fetch secondary metrics');
//           const secondaryData = await secondaryResponse.json();
          
//           // Enhance with mock data for the charts
//           secondaryData.categoryData = [
//             { name: secondaryData.topCategory || 'Fiction', value: secondaryData.topCategoryPercentage || 45 },
//             { name: 'Self Help', value: 25 },
//             { name: 'Business', value: 15 },
//             { name: 'Science', value: 10 },
//             { name: 'Other', value: 5 }
//           ];
          
//           secondaryData.deviceData = [
//             { name: secondaryData.topDevice || 'Mobile', value: secondaryData.devicePercentage || 65 },
//             { name: 'Desktop', value: 25 },
//             { name: 'Tablet', value: 10 }
//           ];
          
//           secondaryData.hourlyData = [
//             { hour: '6am', sessions: 120 },
//             { hour: '9am', sessions: 240 },
//             { hour: '12pm', sessions: 180 },
//             { hour: '3pm', sessions: 220 },
//             { hour: '6pm', sessions: 380 },
//             { hour: '9pm', sessions: 450 },
//             { hour: '12am', sessions: 280 }
//           ];
          
//           setSecondaryMetrics(secondaryData);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Unknown error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [activeTab]);

//   // Format data for the charts
//   const formatChartData = () => {
//     if (activeTab === 'usage' && data.length > 0) {
//       return data.map(item => ({
//         date: item.date,
//         sessions: item.sessions,
//         avgDuration: item.avgDuration
//       }));
//     }
    
//     if (activeTab === 'content' && data.length > 0) {
//       return data.map(item => ({
//         name: item?.title?.length > 20 ? item.title?.substring(0, 20) + '...' : item.title,
//         listens: item.listens,
//         completion: item.avgCompletion ? Math.round(item.avgCompletion * 100) : 0
//       }));
//     }
    
//     if (activeTab === 'users' && data.length > 0) {
//       return data.map(item => ({
//         week: `Week ${item.week}`,
//         newUsers: item.newUsers
//       }));
//     }
    
//     if (activeTab === 'revenue' && data.length > 0) {
//       return data.map(item => ({
//         month: item.month,
//         revenue: item.revenue
//       }));
//     }
    
//     return [];
//   };

//   if (error) {
//     return <div className="p-6 text-red-500">Error loading analytics: {error}</div>;
//   }

//   const chartData = formatChartData();

//   // Custom tooltip for charts
//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-3 border shadow-md rounded">
//           <p className="font-medium">{label}</p>
//           {payload.map((entry: any, index: number) => (
//             <p key={index} style={{ color: entry.color }}>
//               {entry.name}: {entry.value} {entry.name === 'completion' ? '%' : ''}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="md:p-6 max-w-full overflow-x-hidden">
//       {/* Header - responsive layout */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
//         <h1 className="text-xl md:text-2xl font-bold text-gray-800">Analytics & Reports</h1>
//         <button 
//           className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md flex items-center justify-center w-full sm:w-auto"
//           onClick={() => window.print()}
//         >
//           <Download size={16} className="mr-2" />
//           Export Report
//         </button>
//       </div>
      
//       {/* Tabs */}
//       <div className="mb-6">
//         {/* Mobile tabs dropdown */}
//         <div className="block sm:hidden">
//           <button 
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="w-full flex items-center justify-between p-3 border rounded-md bg-white"
//           >
//             <span className="font-medium">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analytics</span>
//             <Menu size={20} />
//           </button>
          
//           {mobileMenuOpen && (
//             <div className="mt-2 bg-white border rounded-md shadow-lg z-10 relative">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab}
//                   className={`w-full text-left p-3 ${
//                     activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
//                   }`}
//                   onClick={() => {
//                     setActiveTab(tab);
//                     setMobileMenuOpen(false);
//                   }}
//                 >
//                   {tab.charAt(0).toUpperCase() + tab.slice(1)} Analytics
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
        
//         {/* Desktop tabs */}
//         <div className="hidden sm:block border-b border-gray-200">
//           <nav className="flex overflow-x-auto">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 className={`py-3 px-4 md:py-4 md:px-6 font-medium text-sm whitespace-nowrap border-b-2 ${
//                   activeTab === tab 
//                     ? 'border-blue-500 text-blue-600' 
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)} Analytics
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>
      
//       {/* Analytics content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
//         {/* Main chart */}
//         <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 md:p-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             {activeTab === 'usage' && 'Listening Activity'}
//             {activeTab === 'content' && 'Content Performance'}
//             {activeTab === 'users' && 'User Growth'}
//             {activeTab === 'revenue' && 'Revenue Trends'}
//           </h2>
//           <div className="h-64 md:h-80">
//             {loading ? (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 {activeTab === 'usage' && (
//                   <AreaChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="date" />
//                     <YAxis />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend />
//                     <Area 
//                       type="monotone" 
//                       dataKey="sessions" 
//                       stackId="1"
//                       stroke="#8884d8" 
//                       fill="#8884d8" 
//                       name="Sessions"
//                     />
//                     <Area 
//                       type="monotone" 
//                       dataKey="avgDuration" 
//                       stackId="2"
//                       stroke="#82ca9d" 
//                       fill="#82ca9d" 
//                       name="Avg Duration (min)"
//                     />
//                   </AreaChart>
//                 )}
                
//                 {activeTab === 'content' && (
//                   <BarChart
//                     data={chartData}
//                     layout="vertical"
//                     margin={{ left: 120 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" />
//                     <YAxis 
//                       type="category" 
//                       dataKey="name" 
//                       width={120}
//                     />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend />
//                     <Bar 
//                       dataKey="listens" 
//                       fill="#8884d8" 
//                       name="Listens"
//                     />
//                     <Bar 
//                       dataKey="completion" 
//                       fill="#82ca9d" 
//                       name="Completion (%)"
//                     />
//                   </BarChart>
//                 )}
                
//                 {activeTab === 'users' && (
//                   <AreaChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="week" />
//                     <YAxis />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Area 
//                       type="monotone" 
//                       dataKey="newUsers" 
//                       stroke="#4ade80" 
//                       fill="#4ade80" 
//                       name="New Users"
//                     />
//                   </AreaChart>
//                 )}
                
//                 {activeTab === 'revenue' && (
//                   <LineChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend />
//                     <Line 
//                       type="monotone" 
//                       dataKey="revenue" 
//                       stroke="#a855f7" 
//                       activeDot={{ r: 8 }}
//                       name="Revenue ($)"
//                     />
//                   </LineChart>
//                 )}
//               </ResponsiveContainer>
//             )}
//           </div>
//         </div>
        
//         {/* Key metrics */}
//         <div className="bg-white rounded-lg shadow p-4 md:p-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h2>
//           <div className="space-y-3 md:space-y-4">
//             <div className="p-3 md:p-4 border rounded-lg">
//               <p className="text-sm font-medium text-gray-500">Active Listeners</p>
//               <p className="text-xl md:text-2xl font-bold mt-1">
//                 {loading ? 'Loading...' : keyMetrics.activeListeners?.toLocaleString()}
//               </p>
//               <div className="flex items-center mt-2">
//                 <TrendingUp size={16} className="text-green-500 mr-1" />
//                 <span className="text-sm text-green-500 font-medium">
//                   {keyMetrics.listenerGrowth || 0}%
//                 </span>
//                 <span className="text-xs text-gray-500 ml-1">vs last week</span>
//               </div>
//             </div>
            
//             <div className="p-3 md:p-4 border rounded-lg">
//               <p className="text-sm font-medium text-gray-500">Avg. Session Duration</p>
//               <p className="text-xl md:text-2xl font-bold mt-1">
//                 {loading ? 'Loading...' : keyMetrics.avgSessionDuration ? `${Math.round(keyMetrics.avgSessionDuration / 60)} min` : 'N/A'}
//               </p>
//               <div className="flex items-center mt-2">
//                 <TrendingUp size={16} className="text-green-500 mr-1" />
//                 <span className="text-sm text-green-500 font-medium">
//                   {keyMetrics.durationGrowth || 0}%
//                 </span>
//                 <span className="text-xs text-gray-500 ml-1">vs last week</span>
//               </div>
//             </div>
            
//             <div className="p-3 md:p-4 border rounded-lg">
//               <p className="text-sm font-medium text-gray-500">Completion Rate</p>
//               <p className="text-xl md:text-2xl font-bold mt-1">
//                 {loading ? 'Loading...' : keyMetrics.completionRate ? `${Math.round(keyMetrics.completionRate * 100)}%` : 'N/A'}
//               </p>
//               <div className="flex items-center mt-2">
//                 <TrendingUp size={16} className="text-green-500 mr-1" />
//                 <span className="text-sm text-green-500 font-medium">
//                   {keyMetrics.completionGrowth || 0}%
//                 </span>
//                 <span className="text-xs text-gray-500 ml-1">vs last week</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Secondary metrics with visualization */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
//         <div className="bg-white rounded-lg shadow p-4 md:p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Categories</h3>
//           <div className="h-64">
//             {loading ? (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={secondaryMetrics.categoryData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={5}
//                     dataKey="value"
//                     label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
//                   >
//                     {secondaryMetrics.categoryData?.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4 md:p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Peak Listening Hours</h3>
//           <div className="h-64">
//             {loading ? (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={secondaryMetrics.hourlyData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="hour" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar 
//                     dataKey="sessions" 
//                     fill="#0088FE" 
//                     name="Sessions"
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//             <div className="text-sm text-center mt-2 text-gray-600">
//               Peak time: {secondaryMetrics.peakHours}
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4 md:p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Usage</h3>
//           <div className="h-64">
//             {loading ? (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={secondaryMetrics.deviceData}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     dataKey="value"
//                     label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
//                   >
//                     {secondaryMetrics.deviceData?.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4 md:p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">New Users Growth</h3>
//           <div className="h-64">
//             {loading ? (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey={activeTab === 'users' ? 'week' : 'date'} />
//                   <YAxis />
//                   <Tooltip />
//                   <Line 
//                     type="monotone" 
//                     dataKey="newUsers" 
//                     stroke="#00C49F" 
//                     strokeWidth={2}
//                     dot={{ r: 4 }}
//                     activeDot={{ r: 8 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             )}
//             <div className="text-sm text-center mt-2 text-gray-600">
//               New users this week: {secondaryMetrics.newUsers}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }