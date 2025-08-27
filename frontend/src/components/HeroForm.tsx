import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { SuperheroInput } from '../types/superhero';
import { PowerTag } from './PowerTag';
import { ImageUpload } from './ImageUpload';

interface HeroFormProps {
  initialData?: SuperheroInput;
  onSubmit: (data: SuperheroInput) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  isLoading?: boolean;
}

export const HeroForm: React.FC<HeroFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<SuperheroInput>(
    initialData || {
      nickname: '',
      real_name: '',
      origin_description: '',
      superpowers: [],
      catch_phrase: '',
      images: [],
    }
  );
  const [newPower, setNewPower] = useState('');
  const [errors, setErrors] = useState<Partial<SuperheroInput>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<SuperheroInput> = {};

    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Nickname is required';
    }
    if (!formData.real_name.trim()) {
      newErrors.real_name = 'Real name is required';
    }
    if (!formData.origin_description.trim()) {
      newErrors.origin_description = 'Origin description is required';
    }
    if (!formData.catch_phrase.trim()) {
      newErrors.catch_phrase = 'Catch phrase is required';
    }
    if (formData.superpowers.length === 0) {
      newErrors.superpowers = ['At least one superpower is required'];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const addPower = () => {
    if (newPower.trim() && !formData.superpowers.includes(newPower.trim())) {
      setFormData({
        ...formData,
        superpowers: [...formData.superpowers, newPower.trim()],
      });
      setNewPower('');
      if (errors.superpowers) {
        setErrors({ ...errors, superpowers: undefined });
      }
    }
  };

  const removePower = (index: number) => {
    setFormData({
      ...formData,
      superpowers: formData.superpowers.filter((_, i) => i !== index),
    });
  };

  const handleInputChange = (field: keyof SuperheroInput, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
          Nickname *
        </label>
        <input
          type="text"
          id="nickname"
          value={formData.nickname}
          onChange={(e) => handleInputChange('nickname', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.nickname ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter superhero nickname"
        />
        {errors.nickname && <p className="mt-1 text-sm text-red-600">{errors.nickname}</p>}
      </div>

      <div>
        <label htmlFor="real_name" className="block text-sm font-medium text-gray-700 mb-2">
          Real Name *
        </label>
        <input
          type="text"
          id="real_name"
          value={formData.real_name}
          onChange={(e) => handleInputChange('real_name', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.real_name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter real name"
        />
        {errors.real_name && <p className="mt-1 text-sm text-red-600">{errors.real_name}</p>}
      </div>

      <div>
        <label htmlFor="catch_phrase" className="block text-sm font-medium text-gray-700 mb-2">
          Catch Phrase *
        </label>
        <input
          type="text"
          id="catch_phrase"
          value={formData.catch_phrase}
          onChange={(e) => handleInputChange('catch_phrase', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.catch_phrase ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter catch phrase"
        />
        {errors.catch_phrase && <p className="mt-1 text-sm text-red-600">{errors.catch_phrase}</p>}
      </div>

      <div>
        <label htmlFor="origin_description" className="block text-sm font-medium text-gray-700 mb-2">
          Origin Description *
        </label>
        <textarea
          id="origin_description"
          value={formData.origin_description}
          onChange={(e) => handleInputChange('origin_description', e.target.value)}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
            errors.origin_description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter origin description"
        />
        {errors.origin_description && (
          <p className="mt-1 text-sm text-red-600">{errors.origin_description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Superpowers *</label>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={newPower}
            onChange={(e) => setNewPower(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPower())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a superpower"
          />
          <button
            type="button"
            onClick={addPower}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.superpowers.map((power, index) => (
            <PowerTag
              key={index}
              power={power}
              onRemove={() => removePower(index)}
              removable
            />
          ))}
        </div>
        {errors.superpowers && (
          <p className="mt-1 text-sm text-red-600">At least one superpower is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
        <ImageUpload
          images={formData.images}
          onChange={(images) => setFormData({ ...formData, images })}
        />
      </div>

      <div className="flex space-x-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Hero' : 'Create Hero'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};