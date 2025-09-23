"use client";

import { SortOption, SortOrder } from "@/types/pokemon";
import { cn } from "@/lib/utils";
// removed unused Select import
import { Switch } from "@/components/ui/switch";
import { Combobox } from "./ui/combobox";
import { Button } from "./ui/button";

interface FilterControlsProps {
  type: string;
  onTypeChange: (type: string) => void;
  sortBy: SortOption;
  onSortByChange: (sortBy: SortOption) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  showFavorites: boolean;
  onShowFavoritesChange: (show: boolean) => void;
  types: Array<{ name: string; url: string }>;
  className?: string;
  resetState: () => void
}

export function FilterControls({
  type,
  onTypeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  showFavorites,
  onShowFavoritesChange,
  resetState,
  types,
  className,
}: FilterControlsProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "id", label: "ID" },
    { value: "name", label: "Name" },
    { value: "height", label: "Height" },
    { value: "weight", label: "Weight" },
    { value: "base_experience", label: "Experience" },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Type Filter */}
      <div>
        <label
          htmlFor="type-filter"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Type
        </label>
        <Combobox
          onChange={onTypeChange}
          value={type}
          placeholder="All Types"
          className="w-full"
          options={types.map((typeOption) => ({
            value: typeOption.name,
            label:
              typeOption.name.charAt(0).toUpperCase() +
              typeOption.name.slice(1),
          }))}
          showSearch={false}
          allowClear
          clearLabel="All Types"
        />
      </div>

      {/* Sort Controls */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label
            htmlFor="sort-by"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Sort By
          </label>
          <Combobox
            onChange={(e) => onSortByChange(e as SortOption)}
            value={sortBy}
            placeholder="Sort By"
            className="w-full"
            options={sortOptions}
            showSearch={false}
          />
        </div>

        <div>
          <label
            htmlFor="sort-order"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Order
          </label>
          <Combobox
            onChange={(e) => onSortOrderChange(e as SortOrder)}
            value={sortOrder}
            placeholder="Sort Order"
            className="w-full"
            options={[
              { value: "asc", label: "Ascending" },
              { value: "desc", label: "Descending" },
            ]}
            showSearch={false}
          />
        </div>
      </div>

      {/* Favorites Filter */}
      <div className="flex items-center justify-between">
        <Switch
          id="favorites-filter"
          checked={showFavorites}
          onCheckedChange={(checked) => onShowFavoritesChange(checked)}
        />
        <label htmlFor="favorites-filter" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Show favorites only
        </label>

        <Button
          type="button"
          variant="outline"
          className="ml-auto"
          onClick={resetState}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
