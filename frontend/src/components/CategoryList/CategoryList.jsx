import React from 'react';

function CategoryList({ categories, onSelectCategory }) {
    return (
        <div className="category-list mt-8">
            <h3 className='text-lg mb-4 font-semibold text-left'>Trending Categories</h3>
            <ul className="list-none">
                {categories.map(category => (
                    <li className="inline-block mr-2 mb-2 mt-2" key={category}>
                        <button className='rounded-none bg-white border-t-0 border-l-0 border-r-0 border-b-0 hover:border-b-2 hover:border-neutral-900 text-neutral-900' href="#" onClick={e => {
                            e.preventDefault();
                            onSelectCategory(category);
                        }}>
                            {category}
                            {/* ({country.count}) */}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryList;