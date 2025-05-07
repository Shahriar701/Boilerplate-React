import React, { useState } from 'react';
import '../../styles/outputs.css';

interface TextOutputProps {
  text: string;
  initialMaxLength?: number;
}

const TextOutput: React.FC<TextOutputProps> = ({ 
  text,
  initialMaxLength = 500 
}) => {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = text.length > initialMaxLength;
  
  const displayText = !expanded && needsTruncation 
    ? `${text.substring(0, initialMaxLength)}...` 
    : text;
  
  return (
    <div className="text-output">
      <div className="text-content">
        {displayText.split('\n').map((line, index) => (
          <p key={index}>{line || ' '}</p>
        ))}
      </div>
      
      {needsTruncation && (
        <button 
          className="expand-toggle" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      )}
      
      <div className="text-actions">
        <button 
          className="action-button"
          onClick={() => navigator.clipboard.writeText(text)}
          title="Copy to clipboard"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default TextOutput; 