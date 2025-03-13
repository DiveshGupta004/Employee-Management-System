import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ⏳ Start loading

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false); // ✅ Stop loading after request

      if (response.ok) {
        setMessage(data.message);
        setError("");

        // 🕒 Redirect to login page after 5 seconds
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        setError(data.error || "Something went wrong!");
        setMessage("");
        setTimeout(() => setError(""), 10000);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to send reset email.");
      setMessage("");
      setLoading(false); // ✅ Stop loading on error
      setTimeout(() => setError(""), 10000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

        {message && <p className="text-green-500">{message}</p>}
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
            className={`w-full py-2 rounded-lg ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={loading} // ✅ Disable button while loading
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-blue-500 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
