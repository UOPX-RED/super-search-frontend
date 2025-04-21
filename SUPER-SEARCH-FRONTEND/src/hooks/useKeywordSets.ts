import { useState, useEffect } from 'react';

export interface KeywordSet {
  name: string;
  keywords: string[];
}

export function useKeywordSets() {
  const [savedSets, setSavedSets] = useState<KeywordSet[]>([]);

  useEffect(() => {
    const savedKeywordSets = localStorage.getItem('savedKeywordSets');
    if (savedKeywordSets) {
      try {
        setSavedSets(JSON.parse(savedKeywordSets));
      } catch (e) {
        console.error('Error parsing saved keyword sets:', e);
      }
    }
  }, []);

  const saveKeywordSet = (name: string, keywords: string[]) => {
    if (!name.trim()) return false;
    
    const newSet: KeywordSet = {
      name: name.trim(),
      keywords: [...keywords]
    };
    
    const updatedSets = [...savedSets.filter(set => set.name !== name), newSet];
    setSavedSets(updatedSets);
    localStorage.setItem('savedKeywordSets', JSON.stringify(updatedSets));
    return true;
  };

  const deleteKeywordSet = (name: string) => {
    const updatedSets = savedSets.filter(set => set.name !== name);
    setSavedSets(updatedSets);
    localStorage.setItem('savedKeywordSets', JSON.stringify(updatedSets));
  };

  return {
    savedSets,
    saveKeywordSet,
    deleteKeywordSet
  };
}