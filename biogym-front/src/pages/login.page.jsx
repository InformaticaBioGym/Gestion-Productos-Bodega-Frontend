import { useLogin } from "../hooks/login.hook";
import "./login.page.css";

function LoginPage() {
  const { register, onSubmit, errors, loginErrors, loading } = useLogin();

  return (
    <div className="login-container">
      <div className="login-card">
        
        <img 
          src="/BioGym-logo.png" 
          alt="BioGym Logo" 
          className="login-logo"
        />

        <h1 className="login-title">Inventario BioGym</h1>
        <h2 className="login-subtitle">Acceso</h2>

        {loginErrors.map((error, i) => (
          <div key={i} className="alert alert-danger">
            {error}
          </div>
        ))}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="ejemplo@biogym.cl"
              {...register("correo", { required: true })}
            />
            {errors.correo && (
              <span className="text-danger">Campo requerido</span>
            )}
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="********"
              {...register("contraseña", { required: true })}
            />
            {errors.contraseña && (
              <span className="text-danger">Campo requerido</span>
            )}
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;