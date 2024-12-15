// Example JobsPerPageSelect component:
import React from 'react';

function JobsPerPageSelect({ value, onChange, options = [10, 30, 50] }) {
  return (
    <select 
      className="border p-2 rounded" 
      value={value} 
      onChange={e => onChange(parseInt(e.target.value, 10))}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt} per page</option>
      ))}
    </select>
  );
}

export default JobsPerPageSelect;