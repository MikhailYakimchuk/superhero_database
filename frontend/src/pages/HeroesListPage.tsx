import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { HeroCard } from '../components/HeroCard';
import { Pagination } from '../components/Pagination';
import { Loader2 } from 'lucide-react';

export const HeroesListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const { data, isLoading, error } = useQuery({
    queryKey: ['superheroes', currentPage, limit],
    queryFn: () => api.getSuperheroes(currentPage, limit),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading superheroes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading superheroes. Please try again.</p>
      </div>
    );
  }

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Superheroes</h1>
        <p className="mt-2 text-gray-600">
          Manage your collection of superheroes
        </p>
      </div>

      {data?.data && data.data.length > 0 ? (
        <>
          {/* Updated grid: 5 cards per row on desktop (xl), 3 on large screens, 2 on medium, 1 on small */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
            {data.data.map((hero) => (
              <HeroCard
                key={hero.id}
                id={hero.id}
                nickname={hero.nickname}
                image={hero.image}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No superheroes found. Create your first one!</p>
        </div>
      )}
    </div>
  );
};