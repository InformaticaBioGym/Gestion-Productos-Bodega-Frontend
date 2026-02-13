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

  const iconStyle = {
    width: "22px",
    height: "22px",
    objectFit: "contain",
    display: "block",
  };

  return (
    <>
      <div className="search-bar-container">
        <img
          src="/icono_buscar.png"
          alt="Buscar"
          className="search-icon"
          onClick={() => onSearch && onSearch(value)}
          style={{
            ...iconStyle,
            cursor: onSearch ? "pointer" : "default",
          }}
        />
        <input
          className="search-input"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
        {showScanner && (
          <img
            src="/icono_codigo.png"
            alt="Escanear"
            onClick={() => setMostrarScanner(true)}
            title="Escanear código"
            style={{
              ...iconStyle,
              cursor: "pointer",
              marginLeft: "10px",
            }}
          />
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
