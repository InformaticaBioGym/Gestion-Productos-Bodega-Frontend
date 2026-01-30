import { useForm } from "react-hook-form";
import { useAuth } from "../context/auth.context.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.page.css";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, isAuthenticated, errors: loginErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    signin(values);
  });

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
