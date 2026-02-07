import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/feed`, { title: title.trim(), content: content.trim() });
      navigate('/');
    } catch (err) {
      setError('Erro ao criar publicação. Tente novamente.');
      console.error('Error creating post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
          Título
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da publicação"
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
          Conteúdo
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva sua publicação..."
          required
          rows={6}
          maxLength={5000}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent resize-none"
        />
        <p className="text-xs text-gray-400 dark:text-dark-text-secondary text-right mt-1">
          {content.length}/5000
        </p>
      </div>

      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex-1 py-2.5 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-hover transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || !title.trim() || !content.trim()}
          className="flex-1 py-2.5 bg-primary dark:bg-accent text-white dark:text-primary-dark font-medium rounded-lg hover:bg-primary-light dark:hover:bg-accent-light transition-colors disabled:opacity-50"
        >
          {submitting ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </form>
  );
}
