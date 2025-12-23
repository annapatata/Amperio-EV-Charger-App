// components/layout/FloatingSearch.jsx
export default function FloatingSearch({ onSearch, onFilterChange }) {
  return (
    <div className="search-filter-container">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Find charging stations..." 
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      <div className="filter-pill-container">
        <button className="filter-pill" onClick={() => onFilterChange('power')}>Power</button>
        <button className="filter-pill" onClick={() => onFilterChange('connector')}>Connector</button>
        <button className="filter-pill" onClick={() => onFilterChange('available')}>Available Now</button>
        <button className="filter-pill" onClick={() => onFilterChange('top-rated')}>Top Rated</button>
      </div>
    </div>
  );
}