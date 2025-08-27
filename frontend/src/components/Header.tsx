import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Plus } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/heroes" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <Shield className="h-8 w-8" />
            <span className="text-xl font-bold">SuperHero Manager</span>
          </Link>
          <Link
            to="/heroes/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Superhero</span>
          </Link>
        </div>
      </div>
    </header>
  );
};