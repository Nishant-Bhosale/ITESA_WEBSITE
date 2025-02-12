import React, { useState } from "react";

//api call
import { signup } from "../auth/helper/index";

//reactstrap
import { Button } from "reactstrap";
import "./Signup.css";

//img
// import img from "../../assets/system-administrator-removebg-preview.png";

//custom-toast
import makeToast from "../../components/utils/Toaster/Toaster";

//react-router-dom
import { Link, useHistory } from "react-router-dom";

const SignUp = () => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminInfo: "",
    error: "",
  });

  const { name, email, password, adminInfo } = formData;

  const handleChange = name => e => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // console.log("inside");
    signup({ name, email, password, adminInfo })
      .then(data => {
        console.log("DATA : ", data);
        if (data.error) {
          setFormData({ ...formData, error: data.error });
          makeToast("error", data.error);
        } else {
          makeToast("success", "Successfully Signed up!");
          setFormData({
            name: "",
            email: "",
            password: "",
            adminInfo: "",
            error: "",
          });

          history.push("/admin/dashboard");
        }
      })
      .catch(err => makeToast("error", err));
  };

  return (
    <>
      <div className="signup-section signup-section-dark">
        <div className="signup-parent">
          {/* <div className="signup-child child1">
            <img src={img} alt="" className="signup-image" />
          </div> */}
          <div className="signup-child child2">
            <React.Fragment>
              <div className="signup-card signup-card-dark">
                <h1 className="signup-header-text signup-header-text-dark">
                  Admin SignUp
                </h1>
                <div className="inside-signup">
                  <form>
                    <div className="signup-input signup-input-dark">
                      <input
                        autoFocus="on"
                        autoComplete="off"
                        id="txt_name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={handleChange("name")}
                      />
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="signup-input signup-input-dark">
                      <input
                        autoComplete="off"
                        id="txt_email"
                        type="text"
                        value={email}
                        placeholder="Your Email"
                        onChange={handleChange("email")}
                      />
                      <i className="fas fa-envelope-open-text"></i>
                    </div>
                    <div className="signup-input signup-input-dark">
                      <input
                        autoComplete="off"
                        id="txt_subject"
                        type="password"
                        value={password}
                        placeholder="Your Password"
                        onChange={handleChange("password")}
                      />
                      <i className="fas fa-pencil-alt"></i>
                    </div>
                    <div className="signup-input signup-input-dark">
                      <textarea
                        autoComplete="off"
                        id="txt_message"
                        rows="4"
                        cols="20"
                        value={adminInfo}
                        placeholder="Admin Info"
                        onChange={handleChange("adminInfo")}
                      ></textarea>
                      <i className="fas fa-comment-dots"></i>
                    </div>
                    <div>
                      <Button
                        className="submit-btn"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "10px",
                      }}
                    >
                      <span>
                        Have an account ?
                        <Link to="/admin/sign-in">
                          <span
                            style={{
                              color: "#FFC107",
                              paddingLeft: "0.5em",
                              textDecoration: "none",
                            }}
                          >
                            Login here
                          </span>
                        </Link>
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </React.Fragment>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
