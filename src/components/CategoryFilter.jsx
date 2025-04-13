import React from "react";
import { categories } from "../utils/constant";
const CategoryFilter = ({ selected, onChange }) => {


    return (
        <select
            value={selected}
            onChange={(e) => onChange(e.target.value)}
            className="border p-2 rounded"
        >
            <option value="">All Categories</option>
            {categories.map((cat) => (
                <option key={cat} value={cat}>
                    {cat}
                </option>
            ))}
        </select>
    );
};

export default CategoryFilter;
