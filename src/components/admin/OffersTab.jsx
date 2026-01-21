import React from 'react';
import { Tag, Plus, Edit, Trash2 } from "lucide-react";
import { Card, Button, ToggleSwitch } from '../ui/SharedComponents';

export default function OffersTab({ coupons, setCoupons, openModal }) {
    const handleToggle = (id) => {
    const updatedCoupons = coupons.map((c) =>
      c.id === id ? { ...c, active: !c.active } : c,
    );
    setCoupons(updatedCoupons);
  };

  return (

    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Active Festivals & Offers
          </h2>
          <p className="text-sm text-slate-500">
            Manage global discounts and coupon codes
          </p>
        </div>
        <Button onClick={() => openModal("coupon")}>
          <Plus className="w-4 h-4" /> Create Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <Card
            key={coupon.id}
            className="relative overflow-hidden group hover:shadow-md transition-all duration-300"
          >
            {/* Decorative Background Pattern */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Tag className="w-24 h-24 transform rotate-12" />
            </div>

            <div className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    coupon.active
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {coupon.active ? "Active" : "Inactive"}
                </div>

                {/* THE TOGGLE SWITCH */}
                <ToggleSwitch
                  active={coupon.active}
                  onClick={() => {
                    // In real life, this triggers the API call
                    const updatedCoupons = coupons.map((c) =>
                      c.id === coupon.id ? { ...c, active: !c.active } : c,
                    );
                    setCoupons(updatedCoupons);
                  }}
                />
              </div>

              <div className="mb-4">
                <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {coupon.code}
                </h3>
                <p className="text-slate-500 font-medium">{coupon.type}</p>
              </div>

              <div className="flex items-end justify-between border-t border-slate-100 pt-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">
                    Discount
                  </span>
                  <p className="text-lg font-bold text-slate-900">
                    {coupon.discount} OFF
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );}

