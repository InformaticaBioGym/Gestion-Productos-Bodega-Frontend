import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "../styles/layout.css";

const BarcodeScannerModal = ({ onClose, onScan }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      /* verbose= */ false,
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
        onClose();
      },
      (error) => {},
    );

    return () => {
      scanner
        .clear()
        .catch((error) => console.error("Error clearing scanner", error));
    };
  }, [onScan, onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "500px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
          }}
        >
          X
        </button>
        <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
          Escaneando...
        </h3>
        <div id="reader"></div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
