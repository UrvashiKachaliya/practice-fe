import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { uploadProductImage } from '../helpers/apiRequest';

const ImageUpload = ({ value, onChange, error }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [uploadMode, setUploadMode] = useState('url');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
     const response = await uploadProductImage(formData);

      if (response.data.success) {
        const imageUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${response.data.imageUrl}`;
        onChange(imageUrl);
        toast.success('Image uploaded successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload image');
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    onChange(url);
    setPreview(url);
  };

  const handleRemoveImage = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            uploadMode === 'url'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            uploadMode === 'file'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Upload File
        </button>
      </div>

      {/* URL Input Mode */}
      {uploadMode === 'url' && (
        <div>
          <input
            type="text"
            value={value || ''}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
          />
        </div>
      )}

      {/* File Upload Mode */}
      {uploadMode === 'file' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              uploading
                ? 'border-orange-300 bg-orange-50'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-orange-400'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-sm text-orange-600 font-medium">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold text-orange-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP up to 5MB</p>
              </div>
            )}
          </label>
        </div>
      )}

      {/* Image Preview */}
      {preview && (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => {
                setPreview('');
                toast.error('Failed to load image');
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
              >
                Remove Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ImageUpload;
