import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { IndianRupee, ShoppingBag, Box } from 'lucide-react';

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const categoryData = [
  { name: 'Bridal', value: 120 },
  { name: 'Casual', value: 200 },
  { name: 'Party', value: 150 },
  { name: 'Ethnic', value: 80 },
  { name: 'Office', value: 45 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DashboardHome() {
  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* 1. TOP CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Revenue</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">₹4,23,000</h3>
            <p className="text-green-500 text-xs sm:text-sm mt-2 font-medium flex items-center flex-wrap gap-1">
              ↗ +12.5%
              <span className="text-gray-400">from last month</span>
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Active Orders</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">24</h3>
          </div>
          <div className="p-2 sm:p-3 bg-orange-50 text-orange-600 rounded-lg">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Products Sold */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Products Sold</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">595</h3>
          </div>
          <div className="p-2 sm:p-3 bg-green-50 text-green-600 rounded-lg">
            <Box className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Overview (Line Chart) */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">Revenue Overview</h3>
            {/* Example: time range selector for future */}
          </div>
          <div className="relative w-full" style={{ minHeight: '220px', height: '40vh', maxHeight: '360px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution (Pie Chart) */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Category Distribution</h3>
          
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 flex-1">
            <div className="relative w-full md:w-1/2" style={{ minHeight: '200px', height: '32vh', maxHeight: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* center text or total can go here */}
              </div>
            </div>

            {/* Custom Legend */}
            <div className="mt-4 md:mt-0 md:w-1/2 space-y-2 sm:space-y-3">
              {categoryData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-gray-600 truncate">{entry.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
