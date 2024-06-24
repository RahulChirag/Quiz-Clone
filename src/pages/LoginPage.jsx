import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/FirebaseAuthContext";
import { Loading } from "../components/Components";

const LoginPage = () => {
  const { login } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password, setError, setResult);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (result === true) {
      navigate("/dashboard");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [result]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="h-screen w-full bg-sky-300 flex justify-center items-center p-4">
      <section className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-sky-700">Log In</h1>
        </div>
        <div className="mb-4">
          {error && (
            <h1 className="text-red-500 text-center">{error.message}</h1>
          )}
          {result && <h1 className="text-green-500 text-center">Done</h1>}
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              placeholder="Enter your email here"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password:
            </label>
            <input
              type="password"
              placeholder="Enter your password here"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-sky-700 text-white py-2 rounded-lg shadow-md hover:bg-sky-600 transition duration-300"
            >
              Login
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
