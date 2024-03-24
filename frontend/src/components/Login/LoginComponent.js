import React, { useEffect, useState } from "react";
import { EMAIL_URL, PASS_URL } from "../../utils/images";
import { Link, useNavigate } from "react-router-dom";
import LoginService from "../../Services/LoginService";
import "../../css/LoginComponent.css";
import { useTranslation } from "react-i18next";
import LanguageButton from "../Header/LanguageButton";
import DoctorHomePage from "../HomePage/DoctorHomePage";
import AdminHomePage from "../HomePage/AdminHomePage";
import IsPasswordChangeService from "../../Services/IsPasswordChangeService";

const LoginComponent = () => {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await LoginService.AddUser(requestData);

      console.log("response jwt", response);
      if (response) {
        // Handle successful login, e.g., redirect to another page
        alert("Login successful");
        localStorage.setItem("JWT", response.data.jwtToken);
        localStorage.setItem("ROLE", response.data.role);
        localStorage.setItem("User_Id", response.data.user_id);

        console.log("user response.data ", response.data);

        const changepass_response = await IsPasswordChangeService.isPasswordChanged(response);

        console.log("Change pas", changepass_response);

        if (changepass_response === false) navigate("/change-password");
        else {
          if (response.data.role === "[ROLE_ADMIN]") navigate("/admin-home");
          else if (response.data.role === "[ROLE_DOCTOR]") {
            navigate("/doctor-home", { replace: true });
          } else {
            navigate("/supervisor-home", { replace: true });
          }
        }
      }
    } catch (error) {
      console.log("error",error.response);
      if(error.response.data === "CREDENTIALS INVALID ! ")alert("CREDENTIALS INVALID !!! Please Enter valid CREDENTIALS")
      else if (error.response.data)
        alert("Access restricted. Please log in during operating hours");
      else alert(`Login Failed : ${error.response.data}`);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("JWT") !== null && localStorage.getItem("ROLE") === "[ROLE_ADMIN]") navigate("/admin-home", { replace: true });
    if (localStorage.getItem("JWT") !== null && localStorage.getItem("ROLE") === "[ROLE_DOCTOR]") navigate("/doctor-home", { replace: true });
    if (localStorage.getItem("JWT") !== null && localStorage.getItem("ROLE") === "[ROLE_SUPERVISOR]") navigate("/supervisor-home", { replace: true });
  }, []);

  return (
    <div className="mb-20">
      <form onSubmit={handleSubmit}>
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <LanguageButton />
        </div>
        <div className="login-container ">
          <div className="header">
            <div className="text">{t("login.LOGIN")}</div>
            <div className="underline"></div>
          </div>
          <div className="inputs">
            <div className="input">
              <img className="img" src={EMAIL_URL} alt="" />
              <input
                
                placeholder={t("login.username")}
                name="username"
                value={requestData.username}
                onChange={handleChange}
              />
            </div>
            <div className="input">
              <img className="img" src={PASS_URL} alt="" />
              <input
                type="password"
                placeholder={t("login.Password")}
                name="password"
                value={requestData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="forgot-password">
            {t("login.forgot-password")}?
            <Link to="/forgot-password">{t("login.Click_Here")}!</Link>
          </div>
          <div className="submit-container">
            <button type="submit" className="submit">
              {t("login.LOGIN")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;