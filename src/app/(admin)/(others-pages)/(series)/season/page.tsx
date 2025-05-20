import React from 'react';
// import UploadSeasonForm from './UploadSeasonForm';
// import UploadSeasonForm from '@/components/UploadSeasonForm';

import  UploadSeasonForm from "../season/UploadSeasonForm"
const SeasonPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Add a New Season</h1>
      <UploadSeasonForm />
    </div>
  );
};

export default SeasonPage;
