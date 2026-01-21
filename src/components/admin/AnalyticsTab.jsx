import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, ShoppingBag, Package, IndianRupeeIcon } from "lucide-react";
import { Card } from '../ui/SharedComponents';
import { analyticsData, categoryData } from '../../data/mockData.js';

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  export default function AnalyticsTab() {
    return(
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Cards (Same as before) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">₹4,23,000</h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <IndianRupeeIcon className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-green-600 text-sm mt-4 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.5% from last month
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">Active Orders</p>
              <h3 className="text-2xl font-bold mt-1">24</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">Products Sold</p>
              <h3 className="text-2xl font-bold mt-1">595</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue Line Chart (Same as before) */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                  itemStyle={{ color: "#4f46e5" }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{
                    fill: "#4f46e5",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Category Distribution (Donut Chart) */}
        <Card className="p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Category Distribution</h3>
          <div className="flex-1 flex items-center">
            {/* The Pie Chart */}
            <div className="h-64 w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="sales"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend (HTML/Tailwind for better control) */}
            <div className="w-1/2 pl-6 space-y-3">
              {categoryData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {item.sales}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );}

  