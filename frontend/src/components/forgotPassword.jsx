import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError("");

        // 🕒 Clear message after 10 seconds
        setTimeout(() => setMessage(""), 10000);
      } else {
        setError(data.error || "Something went wrong!");
        setMessage("");

        // 🕒 Clear error after 10 seconds
        setTimeout(() => setError(""), 10000);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to send reset email.");
      setMessage("");

      // 🕒 Clear error after 10 seconds
      setTimeout(() => setError(""), 10000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

        {/* ✅ Success Message */}
        {message && <p className="text-green-500">{message}</p>}
        
        {/* ❌ Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg mb-4"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
