import React from 'react';

const PreviewApp: React.FC = () => {
    // Vite'ın base URL'ini kullan (GitHub Pages için /Porfolio/)
    const pdfUrl = `${import.meta.env.BASE_URL}cv.pdf#toolbar=0&view=FitH`;

    return (
        <div className="h-full w-full bg-[#525659] flex flex-col">
            <iframe
                src={pdfUrl}
                className="w-full h-full border-none"
                title="CV Preview"
                loading="lazy"
            />
        </div>
    );
};

export default PreviewApp;
