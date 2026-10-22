import React, { useState, useEffect } from 'react';
import { MapPin, Truck, RefreshCcw, ShieldCheck, Check, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../util/config';

export default function PincodeChecker({ productPrice = 0 }) {
  const [pincode, setPincode] = useState(() => {
    return localStorage.getItem('checkedPincode') || '';
  });
  const [checkedPin, setCheckedPin] = useState(() => {
    return localStorage.getItem('checkedPincode') || '';
  });
  const [shippingSettings, setShippingSettings] = useState({
    standardShipping: 150,
    ncrShipping: 100,
    freeShippingThreshold: 5000,
    ncrPincodePrefixes: "11,12,201"
  });
  const [estimateData, setEstimateData] = useState(null);

  // Fetch dynamic shipping rules
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/content`)
      .then(res => res.json())
      .then(data => {
        if (data?.shippingSettings) {
          setShippingSettings({
            standardShipping: Number(data.shippingSettings.standardShipping) >= 0 ? Number(data.shippingSettings.standardShipping) : 150,
            ncrShipping: Number(data.shippingSettings.ncrShipping) >= 0 ? Number(data.shippingSettings.ncrShipping) : 100,
            freeShippingThreshold: Number(data.shippingSettings.freeShippingThreshold) >= 0 ? Number(data.shippingSettings.freeShippingThreshold) : 5000,
            ncrPincodePrefixes: data.shippingSettings.ncrPincodePrefixes || "11,12,201"
          });
        }
      })
      .catch(err => console.error("Failed to load shipping settings", err));
  }, []);

  const calculateEstimate = (pin, price, settings) => {
    if (!pin || pin.length !== 6) return null;

    const prefixes = (settings.ncrPincodePrefixes || "").split(',').map(p => p.trim()).filter(Boolean);
    const isNCR = prefixes.some(prefix => String(pin).startsWith(prefix));

    // Calculate dates
    const now = new Date();
    const minDays = isNCR ? 2 : 4;
    const maxDays = isNCR ? 4 : 6;

    const minDate = new Date(now);
    minDate.setDate(now.getDate() + minDays);
    const maxDate = new Date(now);
    maxDate.setDate(now.getDate() + maxDays);

    const formatOpts = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateRangeStr = `${minDate.toLocaleDateString('en-IN', formatOpts)} – ${maxDate.toLocaleDateString('en-IN', formatOpts)}`;

    const isFreeShipping = price >= settings.freeShippingThreshold;
    const shippingFee = isFreeShipping ? 0 : (isNCR ? settings.ncrShipping : settings.standardShipping);

    return {
      pincode: pin,
      isNCR,
      dateRangeStr,
      isFreeShipping,
      shippingFee,
      freeThreshold: settings.freeShippingThreshold
    };
  };

  useEffect(() => {
    if (checkedPin && checkedPin.length === 6) {
      const result = calculateEstimate(checkedPin, productPrice, shippingSettings);
      setEstimateData(result);
    }
  }, [checkedPin, productPrice, shippingSettings]);

  const handleCheck = (e) => {
    e.preventDefault();
    const trimmed = pincode.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      toast.error("Please enter a valid 6-digit Indian PIN code");
      return;
    }

    localStorage.setItem('checkedPincode', trimmed);
    setCheckedPin(trimmed);
    const result = calculateEstimate(trimmed, productPrice, shippingSettings);
    setEstimateData(result);

    if (result.isNCR) {
      toast.success("Delhi NCR delivery location confirmed!");
    } else {
      toast.success("Delivery location confirmed!");
    }
  };

  return (
    <div className="bg-[#FAF8F5] border border-gray-200/80 rounded-2xl p-5 space-y-4">
      {/* Pincode Header & Form */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF2865]" /> Check Delivery Date & Availability
          </label>
        </div>

        <form onSubmit={handleCheck} className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-Digit PIN Code (e.g. 110001)"
              className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-gray-800 focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] outline-none tracking-wider"
            />
          </div>
          <button
            type="submit"
            className="bg-[#1C1917] hover:bg-[#FF2865] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            Check
          </button>
        </form>
      </div>

      {/* Live Estimate Feedback Box */}
      {estimateData && (
        <div className="bg-white rounded-xl p-3.5 border border-emerald-100 shadow-2xs space-y-2 animate-fade-in">
          <div className="flex items-start gap-2.5 text-xs">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#1C1917]">
                Estimated Delivery: <span className="text-emerald-700">{estimateData.dateRangeStr}</span>
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Dispatches within 24–48 hours from our artisan atelier • Tracking link via SMS & Email.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-gray-600">
              Shipping:{' '}
              {estimateData.isFreeShipping ? (
                <strong className="text-emerald-700 font-bold">FREE Delivery</strong>
              ) : (
                <strong className="text-gray-900 font-bold">₹{estimateData.shippingFee}</strong>
              )}
            </span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
              ✓ Cash on Delivery (COD) Available
            </span>
          </div>
        </div>
      )}

      {/* 3 Trust Pillars & Return Summary */}
      <div className="pt-2 border-t border-gray-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-gray-700">
        <div className="flex items-start gap-2">
          <Truck className="w-4 h-4 text-[#FF2865] shrink-0 mt-0.5" />
          <div>
            <strong className="block text-[#1C1917] font-semibold text-[11px]">Free Shipping</strong>
            <span className="text-[10px] text-gray-500">On all orders above ₹{shippingSettings.freeShippingThreshold.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <RefreshCcw className="w-4 h-4 text-[#FF2865] shrink-0 mt-0.5" />
          <div>
            <strong className="block text-[#1C1917] font-semibold text-[11px]">48-Hour Exchange</strong>
            <span className="text-[10px] text-gray-500">Size mismatch? Hassle-free swap</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#FF2865] shrink-0 mt-0.5" />
          <div>
            <strong className="block text-[#1C1917] font-semibold text-[11px]">COD & Prepaid</strong>
            <span className="text-[10px] text-gray-500">100% Secure Payment Gateways</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1">
        <span>*Unboxing video required for exchange requests</span>
        <Link to="/terms" className="text-[#8B5E3C] hover:underline font-bold">
          View Full Policy →
        </Link>
      </div>
    </div>
  );
}
