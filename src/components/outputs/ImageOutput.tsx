import React, { useState } from 'react';
import '../../styles/outputs.css';

interface Annotation {
  id: number;
  label: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

interface ImageOutputProps {
  imageUrl: string;
  annotations?: Annotation[];
  width?: number;
  height?: number;
}

const ImageOutput: React.FC<ImageOutputProps> = ({
  imageUrl,
  annotations = [],
  width = 600,
  height = 400
}) => {
  const [selectedAnnotation, setSelectedAnnotation] = useState<number | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  
  // Generate a consistent color for annotation labels
  const getColorForLabel = (label: string): string => {
    // Simple hash function to generate a color based on the label string
    let hash = 0;
    for (let i = 0; i < label.length; i++) {
      hash = label.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert to RGB color with good visibility (avoiding too dark or too light)
    const r = ((hash & 0xFF0000) >> 16) % 200 + 55;
    const g = ((hash & 0x00FF00) >> 8) % 200 + 55;
    const b = (hash & 0x0000FF) % 200 + 55;
    
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  const handleAnnotationClick = (id: number) => {
    if (selectedAnnotation === id) {
      setSelectedAnnotation(null);
    } else {
      setSelectedAnnotation(id);
    }
  };
  
  return (
    <div className="image-output">
      <div className="image-container">
        <img 
          src={imageUrl} 
          alt="Model output" 
          style={{ maxWidth: '100%', maxHeight: height }}
        />
        
        {annotations.length > 0 && (
          <button 
            className="annotations-toggle"
            onClick={() => setShowAnnotations(!showAnnotations)}
          >
            {showAnnotations ? 'Hide Annotations' : 'Show Annotations'}
          </button>
        )}
        
        {showAnnotations && annotations.map(annotation => {
          const color = annotation.color || getColorForLabel(annotation.label);
          const isSelected = selectedAnnotation === annotation.id;
          
          return (
            <div 
              key={annotation.id}
              className="annotation"
              style={{
                left: `${annotation.x}px`,
                top: `${annotation.y}px`,
                width: `${annotation.width}px`,
                height: `${annotation.height}px`,
                borderColor: color,
                opacity: selectedAnnotation === null || isSelected ? 1 : 0.3,
                backgroundColor: isSelected ? `${color}30` : 'transparent'
              }}
            >
              <div 
                className="annotation-label"
                style={{ backgroundColor: color }}
              >
                {annotation.label} ({(annotation.confidence * 100).toFixed(0)}%)
              </div>
            </div>
          );
        })}
      </div>
      
      {annotations.length > 0 && (
        <div className="detected-objects">
          <h4>Detected Objects:</h4>
          <div className="objects-list">
            {annotations.map(annotation => (
              <div 
                key={annotation.id}
                className={`object-item ${selectedAnnotation === annotation.id ? 'selected' : ''}`}
                onClick={() => handleAnnotationClick(annotation.id)}
              >
                <div 
                  className="object-color" 
                  style={{ backgroundColor: annotation.color || getColorForLabel(annotation.label) }}
                ></div>
                <span>{annotation.label}</span>
                <span className="object-confidence">
                  {(annotation.confidence * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageOutput; 