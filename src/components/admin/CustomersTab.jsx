import React, { useState } from 'react';
import { Search, Ban, Eye, Mail, Phone, Calendar, ShoppingBag, User } from "lucide-react";
import { Card, Button, Badge } from '../ui/SharedComponents';

// --- Inner Component: Customer Details Modal ---
export const CustomerDetailsContent = ({ customer }) => (
  <div className="space-y-6">
    {/* Header Profile */}
    <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
      <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
        {customer.avatar ? (
          <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-8 h-8 text-slate-400" />
        )}
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900">{customer.name}</h3>
        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
           <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</span>
           <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</span>
        </div>
      </div>
      <div className="ml-auto">
         <Badge status={customer.status === "Active"} />
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
        <p className="text-xs text-slate-500 uppercase font-bold">Total Spent</p>
        <p className="text-lg font-bold text-slate-900">₹{customer.totalSpent.toLocaleString()}</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
        <p className="text-xs text-slate-500 uppercase font-bold">Orders</p>
        <p className="text-lg font-bold text-slate-900">{customer.totalOrders}</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
        <p className="text-xs text-slate-500 uppercase font-bold">Joined</p>
        <p className="text-lg font-bold text-slate-900">{customer.joinedDate}</p>
      </div>
    </div>

    {/* Order History Table */}
    <div>
      <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
        <ShoppingBag className="w-4 h-4 text-slate-500" /> Recent Orders
      </h4>
      {customer.history.length > 0 ? (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customer.history.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-mono text-slate-600">{order.id}</td>
                  <td className="px-4 py-3 text-slate-600">{order.date}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">₹{order.total}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs border border-green-100">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <p className="text-slate-500 text-sm">No orders placed yet.</p>
        </div>
      )}
    </div>
  </div>
);

// --- Main Component ---
export default function CustomersTab({ customers, setCustomers, openModal }) {
  
  // Handler to toggle Block/Active
  const toggleBlockUser = (id) => {
    const updated = customers.map(c => 
      c.id === id ? { ...c, status: c.status === "Active" ? "Blocked" : "Active" } : c
    );
    setCustomers(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Search */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Customer Management</h2>
          <p className="text-sm text-slate-500">View and manage your registered users</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow" 
          />
        </div>
      </div>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Spent / Orders</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                
                {/* 1. Name & Avatar */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                      {customer.avatar ? (
                        <img src={customer.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-slate-400 text-xs">{customer.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-400">ID: {customer.id}</p>
                    </div>
                  </div>
                </td>

                {/* 2. Contact Info */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-xs"><Mail className="w-3 h-3 text-slate-400" /> {customer.email}</span>
                    <span className="flex items-center gap-1.5 text-xs"><Phone className="w-3 h-3 text-slate-400" /> {customer.phone}</span>
                  </div>
                </td>

                {/* 3. Status Badge */}
                <td className="px-6 py-4">
                   <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                     customer.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
                   }`}>
                     {customer.status}
                   </span>
                </td>

                {/* 4. Stats */}
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">₹{customer.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{customer.totalOrders} Orders</p>
                </td>

                {/* 5. Joined Date */}
                <td className="px-6 py-4">
                   <div className="flex items-center gap-1.5">
                     <Calendar className="w-3 h-3 text-slate-400" />
                     {customer.joinedDate}
                   </div>
                </td>

                {/* 6. Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => openModal('customer', customer)} 
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors" 
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleBlockUser(customer.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        customer.status === 'Active' 
                        ? 'hover:bg-red-50 text-slate-400 hover:text-red-600' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                      title={customer.status === "Active" ? "Block User" : "Unblock User"}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}