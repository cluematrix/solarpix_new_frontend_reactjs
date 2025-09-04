import React, { useState } from "react";
import { Row, Col, Image, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/Card";
import { withSwal } from "react-sweetalert2";
import logoImg from "../../../assets/images/logo/main_logo.jpg";
import auth1 from "../../../assets/images/auth/solarpix-sign.png";

// MUI Components
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import api from "../../../api/axios";

const SignIn = ({ swal }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^\S+@\S+\.\S+$/;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, newErrors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    const { isValid } = validate();
    // if (!isValid) {
    //   await swal.fire({
    //     icon: "warning",
    //     title: "Validation error",
    //     showConfirmButton: false,
    //     timer: 1200,
    //     toast: true,
    //     position: "top-start",
    //   });
    //   return;
    // }

    try {
      if (isValid) {
        setLoading(true);
        const response = await api.post("api/v1/website/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        console.log(response);
        if (response.data && response.data.success) {
          setLoading(false);
          console.log(response.data.data);
          const { accessToken, user } = response.data;

          sessionStorage.setItem("solarpix_token", accessToken);
          sessionStorage.setItem("roleId", user.role_id);
          sessionStorage.setItem("employee_id", user.id);

          await swal.fire({
            icon: "success",
            title: "Login successful",
            showConfirmButton: false,
            timer: 1200,
            toast: true,
            position: "top-start",
          });
          window.location.reload();
          navigate("/");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      await swal.fire({
        icon: "error",
        title: "Login failed",
        text: error.response?.data?.message || "Invalid email or password",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        position: "top-start",
      });

      setGeneralError("");
    }
  };

  return (
    <section className="login-content">
      <Row className="m-0 align-items-center bg-white vh-100">
        <Col md="6" lg="5">
          <Row className="justify-content-center">
            <Col md="10">
              <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                <Card.Body>
                  <center>
                    {/* <h1 className="logo-title ms-3">SolarPix</h1> */}
                    <img src={logoImg} alt="Logo" width={80} height={80} />
                  </center>
                  <br />
                  <h3
                    className="mb-2 text-center"
                    style={{ fontFamily: "poppins" }}
                  >
                    Sign In
                  </h3>
                  <br />
                  <Form noValidate onSubmit={handleSubmit}>
                    {generalError && (
                      <p className="text-danger text-center">{generalError}</p>
                    )}

                    <Row>
                      {/* Email Field */}
                      <Col lg="12">
                        <Form.Group className="form-group">
                          <FormControl
                            variant="outlined"
                            fullWidth
                            error={!!errors.email}
                          >
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <OutlinedInput
                              id="email"
                              name="email"
                              type="email"
                              label="Email"
                              placeholder="Enter your email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </FormControl>
                          {errors.email && (
                            <Form.Text className="text-danger">
                              {errors.email}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </Col>

                      {/* Password Field */}
                      <Col lg="12">
                        <Form.Group className="form-group">
                          <FormControl
                            variant="outlined"
                            fullWidth
                            error={!!errors.password}
                          >
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                              id="password"
                              name="password"
                              placeholder="Enter your password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={handleChange}
                              label="Password"
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label={
                                      showPassword
                                        ? "Hide password"
                                        : "Show password"
                                    }
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {showPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                          {errors.password && (
                            <Form.Text className="text-danger">
                              {errors.password}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </Col>

                      <Col
                        lg="12"
                        className="d-flex"
                        style={{ marginTop: "-10px", fontSize: "12px" }}
                      >
                        <Link to="/auth/recoverpw">Forgot Password?</Link>
                      </Col>
                    </Row>

                    <br />
                    <div className="d-flex justify-content-center">
                      <Button
                        type="submit"
                        variant="primary w-100"
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Sign In"}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Right Side Image */}
        <Col
          md="6"
          lg="7"
          className="d-md-block d-none bg-primary p-0 mt-n1 vh-100 overflow-hidden"
        >
          <Image
            src={auth1}
            className="Image-fluid gradient-main"
            alt="images"
          />
        </Col>
      </Row>
    </section>
  );
};

export default withSwal(SignIn);
