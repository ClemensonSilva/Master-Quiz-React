import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = (props) => {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        {...props}
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </div>
    </div>
  );
};

export default SearchInput;