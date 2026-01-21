import React from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { Button } from '../ui/SharedComponents';

export const ProductForm = ({ isEdit, product, onCancel }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500 uppercase">Product Name</label>
        <input type="text" defaultValue={product?.name} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Royal Juti" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500 uppercase">Category</label>
        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
          <option>Bridal</option>
          <option>Casual</option>
          <option>Party</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500 uppercase">Price (₹)</label>
        <input type="number" defaultValue={product?.price} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500 uppercase">Stock</label>
        <input type="number" defaultValue={product?.stock} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
      </div>
    </div>
    {/* Image Upload Mockup */}
    <div className="space-y-2 pt-2">
      <label className="text-xs font-medium text-slate-500 uppercase">Product Images</label>
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 cursor-pointer">
        <Upload className="w-8 h-8 mb-2" />
        <span className="text-sm">Click to upload</span>
      </div>
      {isEdit && product?.images && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
          {product.images.map((img, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
    <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-4">
      <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
      <Button>{isEdit ? "Save Changes" : "Create Product"}</Button>
    </div>
  </div>
);