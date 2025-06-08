import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Globe, Droplets, AlertTriangle, Download, Filter, Calendar } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedRegion, setSelectedRegion] = useState('global');

  // Mock data for charts
  const waterFlowData = [
    { name: 'Jan', volume: 2400, efficiency: 85, alerts: 2 },
    { name: 'Feb', volume: 1398, efficiency: 78, alerts: 4 },
    { name: 'Mar', volume: 9800, efficiency: 92, alerts: 1 },
    { name: 'Apr', volume: 3908, efficiency: 88, alerts: 3 },
    { name: 'May', volume: 4800, efficiency: 95, alerts: 0 },
    { name: 'Jun', volume: 3800, efficiency: 89, alerts: 2 },
  ];

  const regionData = [
    { name: 'North America', value: 35, volume: 5600000 },
    { name: 'Europe', value: 28, volume: 4500000 },
    { name: 'Asia', value: 22, volume: 3500000 },
    { name: 'South America', value: 10, volume: 1600000 },
    { name: 'Africa', value: 5, volume: 800000 },
  ];

  const topCountries = [
    { country: 'United States', volume: 2800000, change: 5.2, trend: 'up' },
    { country: 'China', volume: 2600000, change: -2.1, trend: 'down' },
    { country: 'India', volume: 2200000, change: 8.7, trend: 'up' },
    { country: 'Brazil', volume: 1800000, change: 3.4, trend: 'up' },
    { country: 'Russia', volume: 1500000, change: -1.8, trend: 'down' },
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'High extraction rate detected in California region', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'New data source integrated: European Water Agency', time: '5 hours ago' },
    { id: 3, type: 'error', message: 'Data quality issue in Southeast Asia region', time: '1 day ago' },
    { id: 4, type: 'success', message: 'Monthly report generated successfully', time: '2 days ago' },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Water Flow Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time analytics and insights into global groundwater patterns
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Flow Volume"
            value="15.8M L"
            change={5.2}
            icon={Droplets}
            color="bg-blue-500"
          />
          <StatCard
            title="Active Sources"
            value="247"
            change={-2.1}
            icon={Globe}
            color="bg-green-500"
          />
          <StatCard
            title="Countries Monitored"
            value="195"
            change={0}
            icon={Globe}
            color="bg-purple-500"
          />
          <StatCard
            title="Active Alerts"
            value="8"
            change={-12.5}
            icon={AlertTriangle}
            color="bg-red-500"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Water Flow Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Water Flow Trends</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Volume (ML)
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waterFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Regional Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Regional Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Countries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top Water Extraction Countries</h3>
            <div className="space-y-4">
              {topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{country.country}</h4>
                      <p className="text-sm text-gray-600">{(country.volume / 1000000).toFixed(1)}M L/day</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${country.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {country.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-semibold">{Math.abs(country.change)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Alerts Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Alerts</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    alert.type === 'error' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">System Performance & Efficiency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={waterFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Bar dataKey="efficiency" fill="#10B981" name="Efficiency %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="alerts" fill="#EF4444" name="Alerts Count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};