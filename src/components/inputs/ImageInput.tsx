import React, { useState, useRef } from 'react';
import '../../styles/inputs.css';

interface ImageInputProps {
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({ onChange, disabled = false }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file (jpg, png, etc.)');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent
    onChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.length) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="input-container">
      <div 
        className={`image-input-area ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={disabled ? undefined : triggerFileInput}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            {!disabled && (
              <button 
                className="clear-image" 
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                  onChange(null);
                }}
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">🖼️</div>
            <p>Drop an image here or click to upload</p>
            <span className="upload-info">Supports: JPG, PNG, GIF</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageInput; 