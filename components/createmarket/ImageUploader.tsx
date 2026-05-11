"use client";

import React from "react";

interface Props {
    imagePreview: string | null;
    setImagePreview: (val: string | null) => void;
    setValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const ImageUploader = ({ imagePreview, setImagePreview, setValues }: Props) => {

    const handleFile = (file: File) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;

            setImagePreview(result);

            setValues((prev) => ({
                ...prev,
                image: file,
                imagePreview: result,
            }));
        };

        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);

        setValues((prev) => {
            const copy = { ...prev };
            delete copy.image;
            delete copy.imagePreview;
            return copy;
        });
    };

    return (
        <div
            onClick={() => document.getElementById("imageUpload")?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
            }}
            className="w-full h-60 border border-dashed border-[#333] rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#FF394A] transition relative"
        >
            {imagePreview ? (
                <>
                    <img
                        src={imagePreview}
                        className="w-full h-full object-cover rounded-md"
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                        }}
                        className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 text-xs rounded"
                    >
                        Remove
                    </button>
                </>
            ) : (
                <>
                    <div className="mb-2 text-[#8B8B8B]">
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>

                    <p className="text-[#8B8B8B] text-sm">
                        Click or drag image here
                    </p>

                    <p className="text-xs text-[#555] mt-1">
                        PNG, JPG, WEBP supported
                    </p>
                </>
            )}

            <input
                id="imageUpload"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />
        </div>
    );
};

export default ImageUploader;