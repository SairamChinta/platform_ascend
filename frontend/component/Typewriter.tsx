'use client';

import { useEffect, useState } from 'react';

const words = ['anything', 'workflows', 'tasks', 'your way', 'ideas'];

export default function Typewriter() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index % words.length];
    const timeout = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? currentWord.substring(0, charIndex - 1)
          : currentWord.substring(0, charIndex + 1)
      );
      setCharIndex(isDeleting ? charIndex - 1 : charIndex + 1);

      if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      }

      if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setIndex((prev) => prev + 1);
      }
    }, isDeleting ? 50 : 120);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, index]);

  return (
    <span className="font-bold text-rose-600">
      {displayText}
      <span className="border-r-2 border-rose-600 animate-pulse ml-1" />
    </span>
  );
}
