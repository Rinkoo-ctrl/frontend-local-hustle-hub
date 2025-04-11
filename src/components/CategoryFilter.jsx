import React from "react";

const CategoryFilter = ({ selected, onChange }) => {
  const categories = ["Plumber", "Electrician", "Tutor", "Designer"];

  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat.toLowerCase()}>
          {cat}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;
