import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../components/backend/context/Auth";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("https://construction-aqri.onrender.com/api/authenticate", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      // console.log(result);

      if (result.status === false) {
        toast.error(result.errors || "Login failed");
      } else {
        const userInfo = {
          id: result.id,
          token: result.token,
        };

        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        login(userInfo);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="">
      <main className="">
        <div className="container my-5">
          <div className="login-form my-5">
            <div className="row">
              <div className="col-4 mx-auto">
                <div className="card border-0 shadow">
                  <div className="card-body">
                    <form
                      action=""
                      className=""
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <h4 className="mb-3 text-center">Login Here</h4>
                      <hr />
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Email
                        </label>
                        <input
                          {...register("email", {
                            required: "Valid is required",
                            required: true,
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Please enter a valid email address",
                            },
                          })}
                          type="email"
                          placeholder="Email"
                          className={`form-control ${
                            errors.email && "is-invalid"
                          }`}
                        />
                        {errors.email && (
                          <p className="invalid-feedback">
                            {errors.email?.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Password
                        </label>
                        <input
                          {...register("password", {
                            required: "Password is required",
                          })}
                          type="password"
                          placeholder="Password"
                          className={`form-control ${
                            errors.password && "is-invalid"
                          }`}
                        />
                        {errors.password && (
                          <p className="invalid-feedback">
                            {errors.password?.message}
                          </p>
                        )}
                      </div>
                      <button className="btn btn-primary">Login</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
