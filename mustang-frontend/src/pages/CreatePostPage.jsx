import CreatePostForm from '../components/CreatePostForm';

export default function CreatePostPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-20 md:pb-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
        Nova publicação
      </h2>
      <CreatePostForm />
    </div>
  );
}
