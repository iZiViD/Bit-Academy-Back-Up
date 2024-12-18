import { Button } from "../atoms/_index";

type FilterButtonGroupProps = {
  onFilterChange: (filter: "none" | "grayscale" | "sepia" | "invert") => void;
  disabled: boolean;
};

const FilterButtonGroup = ({ onFilterChange, disabled }: FilterButtonGroupProps) => (
  <div className="flex gap-2">
    {["none", "grayscale", "sepia", "invert"].map((filterType) => (
      <Button
        key={filterType}
        onClick={() => onFilterChange(filterType as "none" | "grayscale" | "sepia" | "invert")}
        disabled={disabled}
        variant={filterType === "none" ? "secondary" : "primary"}
      >
        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
      </Button>
    ))}
  </div>
);

export default FilterButtonGroup;