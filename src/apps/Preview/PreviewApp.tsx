import React from 'react';

const PreviewApp: React.FC = () => {
    return (
        <div className="h-full w-full bg-[#525659] flex flex-col">
            <iframe
                src="/cv.pdf#toolbar=0&view=FitH"
                className="w-full h-full border-none"
                title="CV Preview"
                loading="lazy"
            />
        </div>
    );
};

export default PreviewApp;
