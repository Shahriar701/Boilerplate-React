import React, { useState } from 'react';
import '../../styles/inputs.css';

interface TextInputProps {
  onChange: (text: string) => void;
  placeholder?: string;
  initialValue?: string;
  disabled?: boolean;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
}

const TextInput: React.FC<TextInputProps> = ({ 
  onChange, 
  placeholder = 'Enter text here...', 
  initialValue = '',
  disabled = false,
  minRows = 5,
  maxRows = 10,
  maxLength
}) => {
  const [text, setText] = useState(initialValue);
  const [charCount, setCharCount] = useState(initialValue.length);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
    onChange(newText);
  };

  const clearText = () => {
    setText('');
    setCharCount(0);
    onChange('');
  };

  return (
    <div className="input-container">
      <div className={`text-input-area ${disabled ? 'disabled' : ''}`}>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={minRows}
          maxLength={maxLength}
          style={{ minHeight: `${minRows * 24}px`, maxHeight: `${maxRows * 24}px` }}
        />
        
        <div className="text-input-footer">
          {maxLength && (
            <div className="char-counter">
              <span className={charCount > maxLength * 0.9 ? 'near-limit' : ''}>
                {charCount} / {maxLength}
              </span>
            </div>
          )}
          
          {!disabled && text.length > 0 && (
            <button className="clear-text" onClick={clearText}>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextInput; 