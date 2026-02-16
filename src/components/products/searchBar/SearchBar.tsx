import './SearchBar.css';

import type { ChangeEvent, FC } from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ value, onChange }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="search-container">
            <span className="search-icon" />
            <input
                type="text"
                className="search-input"
                placeholder="Поиск товаров..."
                value={value}
                alt="search"
                onFocus={(e) => e.target.select()}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchBar;
