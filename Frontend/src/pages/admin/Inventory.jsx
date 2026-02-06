import { useEffect, useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, 
  Filter, AlertCircle, CheckCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';
import { toast } from 'react-hot-toast'; 
import { confirmAction } from '../../util/toastUtils'; 

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { userInfo } = useSelector((state) => state.auth);

  // --- FETCH PRODUCTS ---
  const fetchProducts = async () => {
    try {
      // List view can remain on the base route
      const res = await fetch(`${API_BASE_URL}/api/products?pageNumber=1&pageSize=100`); 
      const data = await res.json();
      setProducts(data.products || []); 
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- DELETE HANDLER (FIXED) ---
  const handleDelete = (id) => {
    confirmAction({
      title: "Delete this Product?",
      message: "It will be permanently removed from your inventory.",
      confirmText: "Delete Product",
      onConfirm: async () => {
        const toastId = toast.loading("Deleting...");
        
        try {
          // ✅ FIX: Added '/admin/' to the path to match the backend SEO route structure
          const res = await fetch(`${API_BASE_URL}/api/products/admin/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
          
          if (res.ok) {
            // Update local state to remove the item immediately
            setProducts(prev => prev.filter(p => p._id !== id));
            toast.success('Product deleted successfully', { id: toastId });
          } else {
            const errData = await res.json();
            toast.error(errData.message || 'Failed to delete product', { id: toastId });
          }
        } catch (error) {
          console.error(error);
          toast.error('Server error occurred', { id: toastId });
        }
      }
    });
  };

  // --- FILTERING ---
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
          <p className="text-sm text-gray-500">Manage your products and stock levels.</p>
        </div>
        <Link 
          to="/admin/product/add" 
          className="bg-[#1C1917] text-white px-4 py-3 md:py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or category..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF2865]/20 focus:border-[#FF2865]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* --- DESKTOP VIEW (TABLE) --- */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold text-center">Total Stock</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden border border-gray-200">
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-400">ID: ...{product._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono text-sm">{product.totalStock}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.totalStock > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <CheckCircle className="w-3 h-3" /> In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                        <AlertCircle className="w-3 h-3" /> Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/admin/product/edit/${product._id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE VIEW (CARDS) --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                <img src={product.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 text-sm truncate pr-2">{product.name}</h3>
                  <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100">
                    {product.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 font-mono">ID: ...{product._id.slice(-6)}</p>
                <p className="text-sm font-bold text-gray-900 mt-1">₹{product.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-b border-gray-100 py-3">
              <div className="text-center border-r border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Total Stock</p>
                <p className="text-sm font-mono font-medium text-gray-800">{product.totalStock}</p>
              </div>
              <div className="text-center flex flex-col items-center justify-center">
                 {product.totalStock > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600">
                      <CheckCircle className="w-3 h-3" /> In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600">
                      <AlertCircle className="w-3 h-3" /> Out of Stock
                    </span>
                  )}
              </div>
            </div>

            <div className="flex gap-3">
              <Link 
                to={`/admin/product/edit/${product._id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200"
              >
                <Edit className="w-4 h-4" /> Edit
              </Link>
              <button 
                onClick={() => handleDelete(product._id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 border border-red-100"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-400 text-sm">No products found matching your search.</p>
        </div>
      )}

    </div>
  );
}