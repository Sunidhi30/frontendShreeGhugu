import React from 'react';
// import UploadSeasonForm from './UploadSeasonForm';
// import UploadSeasonForm from '@/components/UploadSeasonForm';

import UploadSeasonForm from "../season/UploadSeasonForm";
const SeasonPage: React.FC = () => {
  return (
    <div className="p-6 dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4 dark:text-white">Add a New Season</h1>
      <UploadSeasonForm />
    </div>
  );
  
};

export default SeasonPage;
