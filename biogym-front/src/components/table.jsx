import "./table.css";

const Table = ({ title, data, renderRow, onAdd, isLoading }) => {
  return (
    <div className="custom-table-container">
      <div className="table-header">
        <span>{title}</span>
        {onAdd && (
          <button className="btn-table-add" onClick={onAdd}>
            Añadir +
          </button>
        )}
      </div>

      <div className="table-body">
        {isLoading ? (
          <p className="table-message">Cargando...</p>
        ) : data && data.length > 0 ? (
          data.map((item, index) => renderRow(item, index))
        ) : (
          <p className="table-message">No hay registros.</p>
        )}
      </div>
    </div>
  );
};

export default Table;
