'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search Pokémon...", className }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounced onChange to avoid too many API calls
  const debouncedOnChange = debounce(onChange, 300);

  const handleInputChange = (newValue: string) => {
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        value={localValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search Pokémon"
        className="pl-10 pr-10"
      />
      {localValue && (
        <Button
          onClick={handleClear}
          variant="ghost"
          size="icon"
          className="absolute inset-y-0 right-0 my-auto mr-1 text-gray-500"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
