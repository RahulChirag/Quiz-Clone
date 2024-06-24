import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useUserAuth } from "../context/FirebaseAuthContext";

const SignUpPage = () => {
  const { code } = useParams();
  const { signUp } = useUserAuth();

  const [role, setRole] = useState("Select from options.");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(false);

  if (code !== "scope369") {
    return;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password, role, setError, setResult);
      setEmail("");
      setPassword("");
      setRole("Select from options.");
    } catch (err) {
      console.log(err.message);
      setEmail("");
      setPassword("");
      setRole("Select from options.");
    }
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <div>{error && <h1>{error.message}</h1>}</div>
      <div>{result && <h1>Done</h1>}</div>
      <div>
        <form onSubmit={handleRegister}>
          <div>
            <label>Set Role:</label>
            <select onChange={(e) => setRole(e.target.value)} value={role}>
              <option value="default">Select from options.</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </div>
          <div>
            <label>Set Email:</label>
            <input
              type="text"
              placeholder="Enter your email here."
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <label>Set Password:</label>
            <input
              type="password"
              placeholder="Enter your password here."
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div>
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignUpPage;
