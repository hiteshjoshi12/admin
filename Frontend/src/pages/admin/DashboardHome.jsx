import { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { IndianRupee, ShoppingBag, Box, Users, ArrowUpRight, ArrowDownRight, Loader2, TrendingUp } from 'lucide-react';
import { API_BASE_URL } from '../../util/config';
import { useSelector } from 'react-redux';

export default function DashboardHome() {
  const { userInfo } = useSelector((state) => state.auth);
  
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    productsSold: 0,
    totalCustomers: 0
  });
  const [graphData, setGraphData] = useState([]);
  const [categoryData, setCategoryData] = useState([]); // Renamed from pieData

  // --- FETCH & PROCESS DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${userInfo.token}` };

        // 1. Fetch Orders
        const orderRes = await fetch(`${API_BASE_URL}/api/orders`, { headers });
        const orders = await orderRes.json();

        // 2. Fetch Users
        const userRes = await fetch(`${API_BASE_URL}/api/users`, { headers });
        const users = await userRes.json();

        // 3. Fetch Products (for mapping)
        const productRes = await fetch(`${API_BASE_URL}/api/products?pageSize=1000`); 
        const productData = await productRes.json();
        const products = productData.products || [];

        if (orderRes.ok && userRes.ok) {
           processDashboardData(orders, users, products);
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo.token]);

  // --- DATA PROCESSING ---
  const processDashboardData = (orders, users, products) => {
      // A. KEY METRICS
      const totalRevenue = orders
          .filter(o => o.isPaid && !o.isCancelled) 
          .reduce((acc, o) => acc + (o.totalPrice || 0), 0);
      
      const activeOrders = orders.filter(o => !o.isDelivered && !o.isCancelled).length;
      
      const productsSold = orders
          .filter(o => o.isPaid)
          .reduce((acc, o) => acc + o.orderItems.reduce((sum, item) => sum + item.quantity, 0), 0);

      // B. REVENUE GRAPH
      const months = {};
      orders.forEach(order => {
          if (!order.isPaid) return;
          const date = new Date(order.createdAt);
          const monthKey = date.toLocaleString('default', { month: 'short' }); 
          months[monthKey] = (months[monthKey] || 0) + order.totalPrice;
      });
      const graph = Object.keys(months).map(key => ({ name: key, value: months[key] }));

      // C. CATEGORY LIST LOGIC
      const categoryCounts = {};
      orders.forEach(order => {
          if (!order.isPaid) return;
          order.orderItems.forEach(item => {
              const productDetail = products.find(p => p._id === (item.product || item._id));
              if (productDetail) {
                  let catName = "Other";
                  if (Array.isArray(productDetail.category) && productDetail.category.length > 0) {
                      catName = productDetail.category[0];
                  } else if (typeof productDetail.category === 'string') {
                      catName = productDetail.category;
                  }
                  categoryCounts[catName] = (categoryCounts[catName] || 0) + item.quantity;
              }
          });
      });

      // Convert to Array & Sort by Highest Sales
      const catArray = Object.keys(categoryCounts)
        .map(key => ({ name: key, value: categoryCounts[key] }))
        .sort((a, b) => b.value - a.value);

      setStats({
          totalRevenue,
          activeOrders,
          productsSold,
          totalCustomers: users.length || 0
      });
      setGraphData(graph.length > 0 ? graph : [{name: 'No Data', value: 0}]);
      setCategoryData(catArray);
  };

  if (loading) return (
     <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#1C1917]" />
     </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. TOP STATS CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
           title="Total Revenue" 
           value={`₹${stats.totalRevenue.toLocaleString()}`} 
           icon={IndianRupee} 
           trend="+12.5%" 
           trendUp={true} 
           color="bg-[#1C1917]"
           textColor="text-white"
        />
        <StatsCard 
           title="Active Orders" 
           value={stats.activeOrders} 
           icon={ShoppingBag} 
           trend="Processing" 
           trendUp={true} 
           color="bg-white"
           textColor="text-[#1C1917]"
        />
        <StatsCard 
           title="Products Sold" 
           value={stats.productsSold} 
           icon={Box} 
           trend="+5%" 
           trendUp={true} 
           color="bg-white"
           textColor="text-[#1C1917]"
        />
        <StatsCard 
           title="Total Customers" 
           value={stats.totalCustomers} 
           icon={Users} 
           trend="+2 New" 
           trendUp={true} 
           color="bg-white"
           textColor="text-[#1C1917]"
        />
      </div>

      {/* 2. ANALYTICS SECTION */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* LEFT: REVENUE GRAPH (Area Chart) */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
                <h3 className="text-lg font-bold text-[#1C1917]">Revenue Analytics</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Financial Performance</p>
            </div>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#1C1917]"></span>
               <span className="text-xs font-bold text-gray-500">Current Period</span>
            </div>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1C1917" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#1C1917" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }} 
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }} 
                    tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)' }}
                    cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#1C1917" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT: TOP CATEGORIES (Linear List) */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="mb-6">
             <h3 className="text-lg font-bold text-[#1C1917] flex items-center gap-2">
                Top Categories <TrendingUp className="w-4 h-4 text-[#1C1917]" />
             </h3>
             <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Based on Units Sold</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {categoryData.length > 0 ? (
                categoryData.map((cat, index) => {
                    // Calculate percentage
                    const percent = stats.productsSold > 0 
                        ? Math.round((cat.value / stats.productsSold) * 100) 
                        : 0;
                    
                    return (
                        <div key={cat.name} className="group">
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-serif text-gray-300 font-bold text-lg w-4">
                                        {index + 1}.
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold text-[#1C1917]">{cat.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{cat.value} items sold</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-[#1C1917]">{percent}%</span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#1C1917] rounded-full transition-all duration-1000 ease-out group-hover:bg-[#FF2865]" 
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-10 opacity-50">
                    <p className="text-sm">No sales data yet.</p>
                </div>
            )}
          </div>
          
          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-gray-100">
             <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Total Items Sold</span>
                <span className="font-bold text-[#1C1917]">{stats.productsSold}</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB COMPONENT: STATS CARD ---
function StatsCard({ title, value, icon: Icon, trend, trendUp, color, textColor }) {
    return (
        <div className={`${color} p-6 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden group`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color === 'bg-[#1C1917]' ? 'bg-white/10' : 'bg-gray-50'}`}>
                    <Icon className={`w-6 h-6 ${color === 'bg-[#1C1917]' ? 'text-white' : 'text-[#1C1917]'}`} />
                </div>
                {/* Trend Badge */}
                {trend && (
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 ${textColor}`}>{title}</p>
                <h3 className={`text-3xl font-serif font-bold ${textColor}`}>{value}</h3>
            </div>
            
            {/* Background Decoration */}
            <div className={`absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={100} className={textColor} />
            </div>
        </div>
    );
}