import React from 'react';
import { X } from 'lucide-react';

interface PowerTagProps {
  power: string;
  onRemove?: () => void;
  removable?: boolean;
}

export const PowerTag: React.FC<PowerTagProps> = ({ power, onRemove, removable = false }) => {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
      {power}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};