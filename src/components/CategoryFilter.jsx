import React, { useState, useRef, useEffect } from "react";
import { categories } from "../utils/constant";

const CategoryFilter = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const toggleCategory = (cat) => {
    if (selected.includes(cat)) {
      onChange(selected.filter(c => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50 flex items-center"
      >
        Categories
        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/>
        </svg>
      </button>
      {open && (
        <div className="absolute mt-2 w-48 bg-white border rounded shadow-lg z-10 p-2 max-h-60 overflow-auto">
          {categories.map(cat => (
            <label key={cat} className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={selected.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="mr-2"
              />
              <span className="capitalize">{cat}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
