import { Button } from '@/components/ui/button';
import { getCategoryIcon } from '@/lib/categoryConfig.ts';

interface CategoryFilterProps {
  categories: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      <Button
        variant={activeCategory === 'all' ? 'default' : 'outline'}
        onClick={() => onCategoryChange?.('all')}
        className="h-20 w-20 p-0 rounded-full shrink-0 flex items-center justify-center text-xl font-bold"
        title="All recipes"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? 'default' : 'outline'}
          onClick={() => onCategoryChange?.(category)}
          className="h-20 w-20 p-0 rounded-full shrink-0 flex items-center justify-center"
          title={category}
        >
          {getCategoryIcon(category, 44)}
        </Button>
      ))}
    </div>
  );
}