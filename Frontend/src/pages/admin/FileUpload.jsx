import { useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../util/config';
import toast from 'react-hot-toast';

export default function FileUpload({ 
  label, 
  value, 
  onUpload, 
  accept = "image/*", 
  placeholder = "Upload Image",
  folderName = "" // <--- 1. Add this new prop
}) {
 const [uploading, setUploading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large (Max 10MB)");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    // <--- 2. Append the folderName to the FormData if it exists
    if (folderName) {
      formData.append('folderName', folderName);
    }

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      onUpload(data.url);
      toast.success("Upload successful!");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{label}</label>}
      
      <div className="flex gap-2 items-center">
        {/* URL Input (Read Only) */}
        <input 
          className="flex-1 p-2 border border-gray-200 rounded text-sm font-mono bg-gray-50 text-gray-500" 
          value={value} 
          readOnly 
          placeholder="File URL will appear here..." 
        />

        {/* Upload Button */}
        <div className="relative">
          <input 
            type="file" 
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <button 
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-bold text-white transition-colors ${
              uploading ? 'bg-gray-400' : 'bg-[#1C1917] hover:bg-[#FF2865]'
            }`}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? '...' : 'Upload'}
          </button>
        </div>

        {/* Clear Button */}
        {value && (
          <button 
            onClick={() => onUpload('')}
            className="p-2 border border-gray-200 rounded hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Clear Image"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}