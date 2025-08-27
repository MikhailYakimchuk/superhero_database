import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { SuperheroInput } from '../types/superhero';
import { HeroForm } from '../components/HeroForm';

export const EditHeroPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: hero, isLoading } = useQuery({
    queryKey: ['superhero', id],
    queryFn: () => api.getSuperheroById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: SuperheroInput) => api.updateSuperhero(id!, data),
    onSuccess: () => {
      toast.success('Superhero updated successfully');
      queryClient.invalidateQueries({ queryKey: ['superhero', id] });
      queryClient.invalidateQueries({ queryKey: ['superheroes'] });
      navigate(`/heroes/${id}`);
    },
    onError: () => {
      toast.error('Failed to update superhero');
    },
  });

  const handleSubmit = async (data: SuperheroInput) => {
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(`/heroes/${id}`);
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

  if (!hero) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Superhero not found</p>
        <Link to="/heroes" className="mt-4 text-blue-600 hover:underline">
          Back to Heroes
        </Link>
      </div>
    );
  }

  const initialData: SuperheroInput = {
    nickname: hero.nickname,
    real_name: hero.real_name,
    origin_description: hero.origin_description,
    superpowers: hero.superpowers,
    catch_phrase: hero.catch_phrase,
    images: hero.images,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to={`/heroes/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Details
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit {hero.nickname}</h1>
          <p className="mt-2 text-gray-600">Update superhero information</p>
        </div>

        <HeroForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  );
};