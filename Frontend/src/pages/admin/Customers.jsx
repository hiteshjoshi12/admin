import { useEffect, useState } from 'react';
import { Mail, Trash2, Search, MapPin, Shield, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { userInfo } = useSelector((state) => state.auth);

  // --- FETCH USERS ---
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userInfo]);

  // --- DELETE HANDLER ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (res.ok) {
          setUsers(users.filter((user) => user._id !== id));
          alert("User deleted successfully");
        } else {
          const data = await res.json();
          alert(data.message || "Failed to delete");
        }
      } catch (error) {
        alert("Server error");
      }
    }
  };

  // --- FILTERING ---
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C1917]"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
           <p className="text-sm text-gray-500">View and manage your registered users</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search name or email..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1C1917]/10"
           />
        </div>
      </div>

      {/* --- DESKTOP VIEW (TABLE) --- */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">User Info</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  
                  {/* Name & Avatar */}
                  <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              {user.name} 
                              {user.isAdmin && <Shield className="w-3 h-3 text-[#FF2865] fill-current" />}
                            </p>
                            <span className="text-xs text-gray-400">ID: {user._id.substring(0,6)}...</span>
                         </div>
                      </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                         <Mail className="w-4 h-4 text-gray-400" />
                         {user.email}
                      </div>
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4">
                      {user.addresses && user.addresses.length > 0 ? (
                         <div className="flex items-start gap-2 text-sm text-gray-600 max-w-[200px]">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">
                              {user.addresses.find(a => a.isPrimary)?.city || user.addresses[0].city}, 
                              {' '}{user.addresses.find(a => a.isPrimary)?.postalCode || user.addresses[0].postalCode}
                            </span>
                         </div>
                      ) : (
                         <span className="text-xs text-gray-400 italic">No address saved</span>
                      )}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    {!user.isAdmin && (
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>

                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                   <td colSpan="5" className="text-center py-12 text-gray-400 italic">
                      No customers found matching "{searchTerm}"
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE VIEW (CARDS) --- */}
      <div className="md:hidden space-y-4">
         {filteredUsers.map((user) => (
            <div key={user._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
               
               {/* Card Header: Avatar, Name, Delete */}
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xl">
                        {user.name.charAt(0).toUpperCase()}
                     </div>
                     <div>
                        <p className="font-bold text-gray-900 flex items-center gap-2">
                           {user.name}
                           {user.isAdmin && <Shield className="w-3 h-3 text-[#FF2865] fill-current" />}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">ID: ...{user._id.slice(-6)}</p>
                     </div>
                  </div>
                  {!user.isAdmin && (
                     <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                     >
                        <Trash2 className="w-5 h-5" />
                     </button>
                  )}
               </div>

               {/* Card Details */}
               <div className="space-y-3 text-sm border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-3 text-gray-600">
                     <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                     <span className="truncate">{user.email}</span>
                  </div>
                  
                  <div className="flex items-start gap-3 text-gray-600">
                     <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                     {user.addresses && user.addresses.length > 0 ? (
                        <span>
                           {user.addresses.find(a => a.isPrimary)?.city || user.addresses[0].city}, 
                           {' '}{user.addresses.find(a => a.isPrimary)?.postalCode || user.addresses[0].postalCode}
                        </span>
                     ) : (
                        <span className="text-gray-400 italic">No address saved</span>
                     )}
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                     <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                     <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
               </div>
            </div>
         ))}

         {filteredUsers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
               <p className="text-gray-400 text-sm">No customers found.</p>
            </div>
         )}
      </div>

    </div>
  );
}