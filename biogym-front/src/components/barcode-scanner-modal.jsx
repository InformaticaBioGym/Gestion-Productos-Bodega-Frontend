import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./barcode-scanner-modal.css";

const BarcodeScannerModal = ({ onClose, onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
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
        if (mountedRef.current) {
          setScanning(false);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error al detener el escáner:", err);
      }
    }
  };

  const iniciarEscaner = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        throw new Error("No se detectaron cámaras.");
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
      } else if (devices.length > 1) {
        cameraId = devices[devices.length - 1].id;
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

      if (mountedRef.current) {
        setScanning(true);
        setLoading(false);
      }
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
      if (mountedRef.current) {
        setErrorMsg(mensaje);
        setLoading(false);
      }
      detenerEscanerInterno();
    }
  };

  const handleStopClick = async () => {
    await detenerEscanerInterno();
  };

  return (
    <div className="scanner-overlay">
      <div className="scanner-modal">
        <h3 className="scanner-title">Escanear Código</h3>

        <div className="scanner-wrapper">
          
          <div id="reader-custom"></div>

          {(!scanning || loading) && (
            <div className="scanner-overlay-ui">
              {loading ? (
                <div className="scanner-placeholder">
                  <span>⏳</span>
                  <p>Iniciando cámara...</p>
                </div>
              ) : (
                <div className="scanner-placeholder">
                  <span>📷</span>
                </div>
              )}
            </div>
          )}
        </div>

        {errorMsg && <div className="scanner-error">{errorMsg}</div>}

        <div className="scanner-actions">
          {!scanning && !loading ? (
            <button onClick={iniciarEscaner} className="scanner-btn start">
              <span>📸</span> Activar Cámara Trasera
            </button>
          ) : (
            <button 
              onClick={handleStopClick} 
              className="scanner-btn stop"
              disabled={loading}
            >
              <span>⏹️</span> {loading ? "Cargando..." : "Detener Escaneo"}
            </button>
          )}

          <button onClick={onClose} className="scanner-btn close">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
