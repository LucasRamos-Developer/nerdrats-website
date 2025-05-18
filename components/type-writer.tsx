'use client';

import { useEffect, useState } from 'react';

interface TypeWriterProps {
  words: string[];
  delay?: number;
  loop?: boolean;
}

export function TypeWriter({ words, delay = 100, loop = true }: TypeWriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(word.substring(0, currentText.length + 1));
        
        if (currentText.length === word.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setCurrentText(word.substring(0, currentText.length - 1));
        
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => {
            if (prev === words.length - 1) {
              return loop ? 0 : prev;
            }
            return prev + 1;
          });
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [currentText, currentWordIndex, delay, isDeleting, loop, words]);

  return (
    <div className="min-h-[2em] text-2xl md:text-4xl font-bold text-primary ">
      {currentText}
      <span className="animate-pulse">|</span>
    </div>
  );
}