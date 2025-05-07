import React, { useState, useEffect } from 'react';
import '../../styles/inputs.css';

interface JsonInputProps {
  onChange: (data: object | null) => void;
  initialValue?: object | null;
  disabled?: boolean;
  schema?: object;
}

const JsonInput: React.FC<JsonInputProps> = ({ 
  onChange, 
  initialValue = null, 
  disabled = false,
  schema
}) => {
  // Store JSON as string for editing
  const [jsonString, setJsonString] = useState(
    initialValue ? JSON.stringify(initialValue, null, 2) : ''
  );
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(!!initialValue);

  // Initial validation
  useEffect(() => {
    if (initialValue) {
      validateJson(JSON.stringify(initialValue, null, 2));
    }
  }, [initialValue]);

  const validateJson = (text: string): boolean => {
    if (!text.trim()) {
      setError(null);
      setIsValid(false);
      return false;
    }

    try {
      const parsedJson = JSON.parse(text);
      
      // Handle schema validation if schema is provided
      if (schema) {
        // This is a very basic schema validation - in a real app, use a library like ajv
        const schemaValidation = validateAgainstSchema(parsedJson, schema);
        if (!schemaValidation.valid) {
          setError(`Schema validation error: ${schemaValidation.error}`);
          setIsValid(false);
          return false;
        }
      }
      
      setError(null);
      setIsValid(true);
      return true;
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setIsValid(false);
      return false;
    }
  };

  // Basic schema validation function
  const validateAgainstSchema = (data: any, schema: any): { valid: boolean; error?: string } => {
    // Just a placeholder for real schema validation
    // In a real app, use a proper JSON Schema validator
    if (typeof data !== typeof schema) {
      return { 
        valid: false, 
        error: `Expected ${typeof schema}, got ${typeof data}` 
      };
    }
    return { valid: true };
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonString(text);
    
    // Validate and update parent
    if (validateJson(text)) {
      try {
        const parsedJson = JSON.parse(text);
        onChange(parsedJson);
      } catch (e) {
        // This shouldn't happen since we already validated
        console.error('JSON parse error after validation', e);
      }
    } else {
      // If invalid, pass null to parent
      onChange(null);
    }
  };

  const formatJson = () => {
    try {
      const parsedJson = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsedJson, null, 2);
      setJsonString(formatted);
    } catch (e) {
      // Don't update if can't parse
    }
  };

  const generateExample = () => {
    if (schema) {
      const example = generateExampleFromSchema(schema);
      setJsonString(JSON.stringify(example, null, 2));
      onChange(example);
      setIsValid(true);
      setError(null);
    } else {
      const example = { 
        example: "data",
        number: 123,
        nested: {
          array: [1, 2, 3],
          boolean: true
        }
      };
      setJsonString(JSON.stringify(example, null, 2));
      onChange(example);
      setIsValid(true);
      setError(null);
    }
  };

  // Generate example data from schema (basic implementation)
  const generateExampleFromSchema = (schema: any): any => {
    // Just a placeholder - in a real app, use a library for this
    if (Array.isArray(schema)) {
      return schema.map(item => generateExampleFromSchema(item));
    } else if (typeof schema === 'object' && schema !== null) {
      const result: Record<string, any> = {};
      for (const key in schema) {
        result[key] = generateExampleFromSchema(schema[key]);
      }
      return result;
    } else if (typeof schema === 'string') {
      return "example_string";
    } else if (typeof schema === 'number') {
      return 123;
    } else if (typeof schema === 'boolean') {
      return true;
    }
    return null;
  };

  return (
    <div className="input-container">
      <div className={`json-input-area ${disabled ? 'disabled' : ''}`}>
        <textarea
          value={jsonString}
          onChange={handleChange}
          placeholder="Enter JSON data here..."
          disabled={disabled}
          spellCheck="false"
          className={`json-editor ${error ? 'has-error' : ''} ${isValid ? 'is-valid' : ''}`}
        />
        
        {error && <div className="json-error">{error}</div>}
        
        <div className="json-input-actions">
          {!disabled && (
            <>
              <button 
                onClick={formatJson} 
                disabled={!jsonString.trim() || disabled}
                className="format-button"
              >
                Format JSON
              </button>
              <button 
                onClick={generateExample}
                disabled={disabled}
                className="example-button"
              >
                Generate Example
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonInput; 