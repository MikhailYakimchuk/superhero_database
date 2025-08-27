import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, ArrowLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { ImageGallery } from '../components/ImageGallery';
import { PowerTag } from '../components/PowerTag';
import { ConfirmModal } from '../components/ConfirmModal';

export const HeroDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: hero, isLoading, error } = useQuery({
    queryKey: ['superhero', id],
    queryFn: () => api.getSuperheroById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteSuperhero(id!),
    onSuccess: () => {
      toast.success('Superhero deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['superheroes'] });
      navigate('/heroes');
    },
    onError: () => {
      toast.error('Failed to delete superhero');
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
    setShowDeleteModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading superhero...</p>
        </div>
      </div>
    );
  }

  if (error || !hero) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Superhero not found</p>
        <Link to="/heroes" className="mt-4 text-blue-600 hover:underline">
          Back to Heroes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to="/heroes"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Heroes
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="lg:flex">
          {/* Image Gallery */}
          <div className="lg:w-1/2 p-6">
            <ImageGallery images={hero.images} nickname={hero.nickname} />
          </div>

          {/* Hero Information */}
          <div className="lg:w-1/2 p-6 lg:border-l border-gray-200">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{hero.nickname}</h1>
                <p className="text-xl text-gray-600">{hero.real_name}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Catch Phrase</h3>
                <p className="text-gray-700 italic">"{hero.catch_phrase}"</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Origin Story</h3>
                <p className="text-gray-700 leading-relaxed">{hero.origin_description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Superpowers</h3>
                <div className="flex flex-wrap gap-2">
                  {hero.superpowers.map((power, index) => (
                    <PowerTag key={index} power={power} />
                  ))}
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created: {new Date(hero.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <Link
                  to={`/heroes/${id}/edit`}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors space-x-2"
                >
                  <Edit className="h-5 w-5" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors space-x-2"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Superhero"
        message={`Are you sure you want to delete ${hero.nickname}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        danger
      />
    </div>
  );
};