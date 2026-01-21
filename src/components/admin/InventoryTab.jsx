import React from 'react';
import { Search, Plus, Image as ImageIcon, Edit, Trash2 } from "lucide-react";
import { Card, Button, Badge } from '../ui/SharedComponents';


  export default function InventoryTab({ products, openModal }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow"
          />
        </div>
        <Button onClick={() => openModal("add")}>
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 tracking-wider">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                      {product.images.length > 1 && (
                        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1 rounded-tl-md">
                          +{product.images.length - 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        ID: #{product.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">
                  ₹{product.price}
                </td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <Badge status={product.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal("edit", product)}
                      className="p-2 hover:bg-white bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-all shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal("delete", product)}
                      className="p-2 hover:bg-red-50 bg-white border border-slate-200 hover:border-red-100 rounded-lg text-red-600 transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );}
