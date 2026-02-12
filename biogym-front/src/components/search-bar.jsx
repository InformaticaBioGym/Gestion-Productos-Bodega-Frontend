import { useState } from "react";
import "../styles/layout.css";
import BarcodeScannerModal from "./barcode-scanner-modal";

function SearchBar({
  placeholder = "Buscar...",
  value,
  onChange,
  onSearch,
  showScanner = false,
}) {
  const [mostrarScanner, setMostrarScanner] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };
  const handleScanSuccess = (decodedText) => {
    const fakeEvent = { target: { value: decodedText } };
    onChange(fakeEvent);
    if (onSearch) onSearch(decodedText);
    setMostrarScanner(false);
  };

  return (
    <>
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
        {showScanner && (
          <span
            className="search-icon"
            onClick={() => setMostrarScanner(true)}
            style={{
              cursor: "pointer",
              marginLeft: "10px",
              fontSize: "1.2rem",
            }}
            title="Escanear código"
          >
            📷
          </span>
        )}
      </div>
      {mostrarScanner && (
        <BarcodeScannerModal
          onClose={() => setMostrarScanner(false)}
          onScan={handleScanSuccess}
        />
      )}
    </>
  );
}

export default SearchBar;
