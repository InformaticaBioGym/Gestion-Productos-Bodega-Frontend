import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export function useLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { signin, isAuthenticated, errors: loginErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    const datosLimpios = {
      ...values,
      correo: values.correo.toLowerCase().trim(),
    };
    await signin(datosLimpios);
  });

  return {
    register,
    onSubmit,
    errors,
    loginErrors,
    loading: isSubmitting,
  };
}
