import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, User } from 'lucide-react';

interface HeroCardProps {
  id: string;
  nickname: string;
  image?: string;
}

export const HeroCard: React.FC<HeroCardProps> = ({ id, nickname, image }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group h-80">
      <div className="bg-gray-200 relative overflow-hidden h-48">
        {image ? (
          <img
            src={image}
            alt={nickname}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-48 bg-gradient-to-br from-blue-400 to-purple-500">
            <User className="h-16 w-16 text-white opacity-60" />
          </div>
        )}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>
      <div className="p-6 flex flex-col justify-between h-32">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 truncate">{nickname}</h3>
        <Link
          to={`/heroes/${id}`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm space-x-2 w-full justify-center mt-auto"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </Link>
      </div>
    </div>
  );
};