import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { IndianRupee, ShoppingBag, Box } from 'lucide-react';

// MOCK DATA (We will replace this with API data later)
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
    <div className="space-y-8">
      
      {/* 1. TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
           <div>
             <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
             <h3 className="text-3xl font-bold text-gray-800 mt-2">₹4,23,000</h3>
             <p className="text-green-500 text-sm mt-2 font-medium flex items-center">
               ↗ +12.5% <span className="text-gray-400 ml-1">from last month</span>
             </p>
           </div>
           <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
             <IndianRupee className="w-6 h-6" />
           </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
           <div>
             <p className="text-gray-500 text-sm font-medium">Active Orders</p>
             <h3 className="text-3xl font-bold text-gray-800 mt-2">24</h3>
           </div>
           <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
             <ShoppingBag className="w-6 h-6" />
           </div>
        </div>

        {/* Products Sold */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
           <div>
             <p className="text-gray-500 text-sm font-medium">Products Sold</p>
             <h3 className="text-3xl font-bold text-gray-800 mt-2">595</h3>
           </div>
           <div className="p-3 bg-green-50 text-green-600 rounded-lg">
             <Box className="w-6 h-6" />
           </div>
        </div>
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
         
         {/* Revenue Overview (Line Chart) */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Overview</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill:'#6366f1', strokeWidth: 2, stroke:'#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Category Distribution (Pie Chart) */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Category Distribution</h3>
            <div className="flex-1 w-full min-h-0 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={60}
                      outerRadius={80}
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
               {/* Center Text Trick */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 {/* <span className="text-sm font-bold text-gray-400">Total</span> */}
               </div>
            </div>
            
            {/* Custom Legend */}
            <div className="space-y-3 mt-4">
              {categoryData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                     <span className="text-gray-600">{entry.name}</span>
                   </div>
                   <span className="font-bold text-gray-900">{entry.value}</span>
                </div>
              ))}
            </div>
         </div>

      </div>
    </div>
  );
}