// frontend/src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // For API requests
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'; // Recharts for bar/line
import { Doughnut } from 'react-chartjs-2'; // Chart.js for donut
import { Chart as ChartJS, ArcElement, Tooltip as ChartJSTooltip, Legend } from 'chart.js'; // Register Chart.js components
ChartJS.register(ArcElement, ChartJSTooltip, Legend);

// Navy blue theme colors
const COLORS = ['#001f3f', '#0074D9', '#7FDBFF', '#39CCCC', '#3D9970']; // Navy and accents

const Dashboard = () => {
  const [activities, setActivities] = useState([]); // Raw activities for table
  const [stats, setStats] = useState({}); // Aggregated stats
  const [filteredActivities, setFilteredActivities] = useState([]); // For table with filters
  const [eventTypeFilter, setEventTypeFilter] = useState(''); // Filter by event type
  const [dateRange, setDateRange] = useState({ start: '', end: '' }); // Date range filter

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const activitiesRes = await axios.get('/api/activity');
        setActivities(activitiesRes.data);
        setFilteredActivities(activitiesRes.data); // Initial filtered = all

        const statsRes = await axios.get('/api/activity/stats');
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    let filtered = activities;
    if (eventTypeFilter) {
      filtered = filtered.filter(act => act.eventType === eventTypeFilter);
    }
    if (dateRange.start) {
      filtered = filtered.filter(act => new Date(act.timestamp) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(act => new Date(act.timestamp) <= new Date(dateRange.end));
    }
    setFilteredActivities(filtered);
  }, [eventTypeFilter, dateRange, activities]);

  // Prepare data for Recharts (daily trends - line chart)
  const dailyData = stats.dailyTrends || [];

  // Prepare data for Recharts (most visited pages - bar chart)
  const pagesData = stats.mostVisitedPages || [];

  // Prepare data for Chart.js (event type distribution - donut)
  const eventTypesData = {
    labels: (stats.totalPerType || []).map(item => item._id),
    datasets: [
      {
        data: (stats.totalPerType || []).map(item => item.count),
        backgroundColor: COLORS,
        hoverBackgroundColor: COLORS.map(color => `${color}aa`), // Add opacity on hover
      },
    ],
  };

  // Calculate summary metrics
  const totalVisits = activities.filter(act => act.eventType === 'PAGE_VISIT').length;
  const uniqueUsers = new Set(activities.map(act => act.userId).filter(id => id)).size;
  const topActions = stats.totalPerType?.slice(0, 3).map(item => item._id).join(', ') || '';

  return (
    <div className="min-h-screen bg-white text-navy-blue p-6">
      {/* Header */}
      <header className="bg-navy-blue text-white p-4 rounded-md shadow-md mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard - User Activity</h1>
      </header>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-md shadow-md border border-navy-blue transition-transform hover:scale-105">
          <h2 className="text-lg font-semibold">Total Page Visits</h2>
          <p className="text-2xl">{totalVisits}</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md border border-navy-blue transition-transform hover:scale-105">
          <h2 className="text-lg font-semibold">Unique Users</h2>
          <p className="text-2xl">{uniqueUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md border border-navy-blue transition-transform hover:scale-105">
          <h2 className="text-lg font-semibold">Top Actions</h2>
          <p>{topActions}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <label className="mr-4">
          Event Type:
          <select
            value={eventTypeFilter}
            onChange={e => setEventTypeFilter(e.target.value)}
            className="ml-2 p-2 border border-navy-blue rounded"
          >
            <option value="">All</option>
            <option value="PAGE_VISIT">Page Visit</option>
            <option value="BUTTON_CLICK">Button Click</option>
            <option value="PRODUCT_VIEW">Product View</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <label className="mr-4">
          Start Date:
          <input
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
            className="ml-2 p-2 border border-navy-blue rounded"
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
            className="ml-2 p-2 border border-navy-blue rounded"
          />
        </label>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Recharts Line Chart - Daily Trends */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-4">Daily Activity Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#001f3f" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recharts Bar Chart - Most Visited Pages */}
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-4">Most Visited Pages</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pagesData}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#001f3f" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart.js Donut Chart - Event Type Distribution */}
        <div className="bg-white p-4 rounded-md shadow-md md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Event Type Distribution</h2>
          <Doughnut data={eventTypesData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="bg-white p-4 rounded-md shadow-md overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-navy-blue text-white">
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Event Type</th>
              <th className="px-4 py-2">Details</th>
              <th className="px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.slice(0, 10).map((act, index) => ( // Show first 10 for simplicity, add pagination as bonus
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{act.userId || 'Anonymous'}</td>
                <td className="px-4 py-2">{act.eventType}</td>
                <td className="px-4 py-2">{JSON.stringify(act.details)}</td>
                <td className="px-4 py-2">{new Date(act.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

// Note: Add to your routes in App.jsx: <Route path="/admin/dashboard" element={<Dashboard />} /> (protect with auth if needed)