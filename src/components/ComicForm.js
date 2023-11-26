// src/components/ComicForm.js
import React, { useState, useEffect } from 'react';

const ComicForm = ({ onSubmit }) => {
  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateInput = (text) => {
    const prompts = text.split('|').map((prompt) => prompt.trim());
    if (prompts.length >= 4) {
      setErrorMessage('');
      return true;
    } else {
      setErrorMessage('Minimum 4 prompts are required.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInput(inputText) && !isLoading) {
      setIsLoading(true);
      const texts = inputText.split('|').map((text) => text.trim());
      await onSubmit(texts);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    validateInput(e.target.value);
  };

  useEffect(() => {
    // Reset loading state when input changes
    setIsLoading(false);
  }, [inputText]);

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <p className='font-semibold'>Enter Comic Prompts (Separated by '|')</p>
      <p className='text-sm mt-1 mb-3'>To generate speech bubbles  type - "Generate images with speech bubbles or text annotations emphasizing...."</p>

      <textarea
        id="comicInput"
        value={inputText}
        onChange={handleInputChange}
        className={`w-full p-2 border border-gray-300 rounded-md ${
          errorMessage ? 'border-red-500' : ''
        }`}
        rows="4"
        placeholder="Type your comic prompts here, separated by '|'"
        disabled={isLoading}
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
        type="submit"
        className={`bg-blue-500 text-white px-4 py-2 rounded-md mt-2 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading || !!errorMessage}
      >
        {isLoading ? 'Generating Comic...' : 'Generate Comic'}
      </button>
    </form>
  );
};

export default ComicForm;
