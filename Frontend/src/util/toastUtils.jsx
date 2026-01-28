import { toast } from 'react-hot-toast';

// Reusable Confirmation Toast
export const confirmAction = ({ 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Yes, Do it", 
  cancelText = "Cancel",
  onConfirm, 
  icon = '⚠️',
  confirmStyle = "bg-red-600 hover:bg-red-700" // Default to Red (Delete)
}) => {
  toast((t) => (
    <div className="flex flex-col gap-2">
      <span className="font-semibold text-sm">{title}</span>
      <span className="text-xs text-gray-500">{message}</span>
      <div className="flex gap-2 mt-2">
        <button 
          onClick={() => {
            toast.dismiss(t.id); // Close the popup
            onConfirm();         // Run the actual function
          }}
          className={`${confirmStyle} text-white px-3 py-1 rounded text-xs font-bold transition-colors`}
        >
          {confirmText}
        </button>
        <button 
          onClick={() => toast.dismiss(t.id)}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs font-bold hover:bg-gray-300 transition-colors"
        >
          {cancelText}
        </button>
      </div>
    </div>
  ), { duration: 5000, icon });
};