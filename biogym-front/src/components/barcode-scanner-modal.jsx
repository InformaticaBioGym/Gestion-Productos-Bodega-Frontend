import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const BarcodeScannerModal = ({ onClose, onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const scannerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      detenerEscanerInterno();
    };
  }, []);

  const detenerEscanerInterno = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        if (mountedRef.current) setScanning(false);
      } catch (err) {
        console.error("Error al detener el escáner:", err);
      }
    }
  };

  const iniciarEscaner = async () => {
    setErrorMsg(null);
    try {
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        throw new Error("No se detectaron cámaras en este dispositivo.");
      }
      let cameraId = devices[0].id;
      const backCamera = devices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("environment") ||
          device.label.toLowerCase().includes("trasera"),
      );

      if (backCamera) {
        cameraId = backCamera.id;
      }

      const html5QrCode = new Html5Qrcode("reader-custom");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          if (mountedRef.current) {
            onScan(decodedText);
            detenerEscanerInterno();
            onClose();
          }
        },
        (errorMessage) => {},
      );

      if (mountedRef.current) setScanning(true);
    } catch (err) {
      console.error("Error al iniciar cámara:", err);
      let mensaje = "Error al acceder a la cámara.";
      if (
        err.name === "NotAllowedError" ||
        err.toString().includes("permission")
      ) {
        mensaje =
          "Permiso de cámara denegado. Por favor, habilítalo en tu navegador.";
      } else if (err.message) {
        mensaje = err.message;
      }
      if (mountedRef.current) setErrorMsg(mensaje);
      detenerEscanerInterno();
    }
  };

  const handleStopClick = async () => {
    await detenerEscanerInterno();
  };

  const btnBaseStyle = {
    padding: "12px 20px",
    borderRadius: "5px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    marginBottom: "10px",
    transition: "background-color 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  };

  const btnStartStyle = {
    ...btnBaseStyle,
    backgroundColor: "#4CAF50",
    color: "white",
  };

  const btnStopStyle = {
    ...btnBaseStyle,
    backgroundColor: "#f44336",
    color: "white",
  };

  const btnCancelStyle = {
    ...btnBaseStyle,
    backgroundColor: "#e0e0e0",
    color: "#333",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "450px",
          position: "relative",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "20px", color: "#333" }}>
          Escanear Código de Barras
        </h3>

        <div
          id="reader-custom"
          style={{
            width: "100%",
            minHeight: "300px",
            backgroundColor: "#000",
            borderRadius: "8px",
            marginBottom: "20px",
            overflow: "hidden",
            display: scanning ? "block" : "none",
          }}
        ></div>

        {!scanning && !errorMsg && (
          <p style={{ marginBottom: "20px", color: "#666" }}>
            Se requiere acceso a la cámara para escanear.
          </p>
        )}

        {errorMsg && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px",
              fontSize: "0.9rem",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {!scanning ? (
            <button style={btnStartStyle} onClick={iniciarEscaner}>
              <span>📸</span> Permitir y Usar Cámara Trasera
            </button>
          ) : (
            <button style={btnStopStyle} onClick={handleStopClick}>
              <span>⏹️</span> Detener Escaneo
            </button>
          )}

          <button style={btnCancelStyle} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
