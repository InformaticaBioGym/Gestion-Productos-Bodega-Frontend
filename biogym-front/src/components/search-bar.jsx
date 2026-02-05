import "../styles/layout.css"; 

function SearchBar({ 
  placeholder = "Buscar...", 
  value, 
  onChange, 
  onSearch 
}) {
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="search-bar-container">
      <span
        className="search-icon"
        onClick={() => onSearch && onSearch(value)}
        style={{ cursor: onSearch ? "pointer" : "default" }}
      >
        🔍
      </span>
      <input
        className="search-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default SearchBar;