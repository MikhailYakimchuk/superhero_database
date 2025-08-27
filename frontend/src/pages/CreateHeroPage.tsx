import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { SuperheroInput } from '../types/superhero';
import { HeroForm } from '../components/HeroForm';

export const CreateHeroPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: SuperheroInput) => api.createSuperhero(data),
    onSuccess: (data) => {
      toast.success('Superhero created successfully');
      queryClient.invalidateQueries({ queryKey: ['superheroes'] });
      navigate(`/heroes/${data._id}`);
    },
    onError: () => {
      toast.error('Failed to create superhero');
    },
  });

  const handleSubmit = async (data: SuperheroInput) => {
    createMutation.mutate(data);
  };

  const handleCancel = () => {
    navigate('/heroes');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to="/heroes"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Heroes
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Superhero</h1>
          <p className="mt-2 text-gray-600">Add a new superhero to your collection</p>
        </div>

        <HeroForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  );
};