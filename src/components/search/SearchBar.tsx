import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export default function SearchBar({ placeholder = "What would you like to cook?", onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-gray-400 size-5" />
        <Input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch?.(e.target.value)}
          className="pl-10 w-full rounded-full"
        />
      </div>
    </div>
  );
}
