import UploadSeriesForm from '@/components/series/UploadSeriesForm';

export default function UploadSeriesPage() {
  return (
    <div className="p-6 dark:bg-gray-900">
    <h1 className="text-2xl font-bold mb-4 dark:text-white">Upload New Series</h1>
    <UploadSeriesForm />
  </div>
  
  );
}
