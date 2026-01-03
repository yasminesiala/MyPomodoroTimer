
import React from 'react';

export const MiffyBunny: React.FC<{ isWorking: boolean }> = ({ isWorking }) => {
  return (
    <div className="relative w-32 h-40 mx-auto flex items-center justify-center">
      {/* 
        INSTRUCTIONS: 
        Place your downloaded image in the project root and name it 'miffy.png'.
        The 'fallback' handles the case where the image isn't found yet.
      */}
      <img 
        src="./miffy.png" 
        alt="Miffy Mascot" 
        className="max-w-full max-h-full object-contain"
        onError={(e) => {
          // If user hasn't added the image yet, show a placeholder box
          e.currentTarget.src = "https://placehold.co/128x160/white/black?text=Put+Miffy+Here";
        }}
      />
    </div>
  );
};
