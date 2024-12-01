import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const PasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent successfully. Check your email.");
    } catch (err) {
      setError("Failed to send reset email. Please check the email address.");
    }
  };

  return (
    <div className=" p-40 bg-white flex items-center justify-center">
      <div className="w-full max-w-md bg-[#f9f9f9] shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-[#320000]">
          Reset Your Password
        </h1>
        <p className="text-sm text-gray-600 text-center mt-2">
          Enter your email to receive a password reset link.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleResetPassword}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@domain.com"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#720000] focus:border-[#720000]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#720000] text-white py-2 px-4 rounded-md hover:bg-[#320000] focus:outline-none focus:ring focus:ring-[#720000] focus:ring-opacity-50"
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}
        <div className="mt-4 text-center">
          {/* <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-[#720000] font-medium hover:underline"
            >
              Login
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default PasswordPage;
