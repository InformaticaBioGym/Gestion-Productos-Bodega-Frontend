import { useLogin } from "../hooks/login.hook";
import "./login.page.css";

function LoginPage() {
  const { register, onSubmit, errors, loginErrors } = useLogin();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>BioGym Inventario Acceso</h1>

        {loginErrors.map((error, i) => (
          <div
            key={i}
            style={{ color: "red", marginBottom: "10px", fontSize: "0.9rem" }}
          >
            {error}
          </div>
        ))}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              {...register("correo", { required: true })}
            />
            {errors.correo && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                Campo requerido
              </span>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              {...register("contraseña", { required: true })}
            />
            {errors.contraseña && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                Campo requerido
              </span>
            )}
          </div>

          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;