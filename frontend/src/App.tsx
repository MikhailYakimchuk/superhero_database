import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { HeroesListPage } from './pages/HeroesListPage';
import { HeroDetailPage } from './pages/HeroDetailPage';
import { CreateHeroPage } from './pages/CreateHeroPage';
import { EditHeroPage } from './pages/EditHeroPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/heroes" replace />} />
              <Route path="/heroes" element={<HeroesListPage />} />
              <Route path="/heroes/new" element={<CreateHeroPage />} />
              <Route path="/heroes/:id" element={<HeroDetailPage />} />
              <Route path="/heroes/:id/edit" element={<EditHeroPage />} />
            </Routes>
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;