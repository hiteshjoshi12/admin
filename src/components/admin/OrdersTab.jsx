import React, { useState } from 'react';
import { Truck, Clock, FileText, MapPin } from "lucide-react";
import { Card, Button } from '../ui/SharedComponents';

// Inner component for the Modal content
export const OrderDetailsContent = ({ order, handleShipOrder }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
      <div><h3 className="text-xl font-bold text-slate-900">Order #{order.id}</h3><p className="text-sm text-slate-500 mt-1">Placed on {order.date}</p></div>
      <div className="text-right">
        {order.awb ? (
          <div className="bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-lg text-center"><p className="text-xs text-indigo-600 font-bold uppercase">Shipped via Shiprocket</p><p className="text-sm font-mono font-bold text-indigo-900">{order.awb}</p></div>
        ) : (
          <Button onClick={() => handleShipOrder(order.id)} className="bg-slate-900 text-white hover:bg-slate-800"><Truck className="w-4 h-4" /> Ship Order</Button>
        )}
      </div>
    </div>
    {/* ... (Rest of details: Customer, Items, etc. simplified for brevity) ... */}
    <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Customer</h4>
            <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-full"><FileText className="w-4 h-4 text-slate-500" /></div>
                <div><p className="text-sm font-semibold">{order.customer}</p><p className="text-sm text-slate-500">{order.email}</p></div>
            </div>
        </div>
        <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Address</h4>
            <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-full"><MapPin className="w-4 h-4 text-slate-500" /></div>
                <p className="text-sm text-slate-600">{order.address}</p>
            </div>
        </div>
    </div>
  </div>
);

export default function OrdersTab({ orders, setOrders, openModal }) {
  const [filter, setFilter] = useState("All");
  const filteredOrders = filter === "All" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div><h2 className="text-xl font-bold text-slate-900">Order Management</h2><p className="text-sm text-slate-500">Track and fulfill customer orders</p></div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {["All", "Pending", "Processing", "Shipped"].map((status) => (
            <button key={status} onClick={() => setFilter(status)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filter === status ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>{status}</button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr><th className="px-6 py-4">Order ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Total</th><th className="px-6 py-4 text-right">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-slate-900">{order.id}</td>
                <td className="px-6 py-4"><p className="font-medium text-slate-900">{order.customer}</p></td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                    {order.status === 'Pending' && <Clock className="w-3 h-3" />}{order.status}
                   </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">₹{order.total}</td>
                <td className="px-6 py-4 text-right"><Button variant="outline" className="ml-auto text-xs py-1.5 h-8" onClick={() => openModal('order', order)}>View Details</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}