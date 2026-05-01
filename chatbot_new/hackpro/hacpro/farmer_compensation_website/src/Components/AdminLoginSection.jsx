import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import loginImage from "../assets/admin.png";

const AdminLoginSection = ({ onNavigate }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Admin Login Successful ✅");
        localStorage.setItem("adminToken", data.token);
        navigate("/adminupload");
      } else {
        alert(data.message || "Invalid credentials ❌");
      }
    } catch (error) {
      alert("Server error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center"
    >
      <div className="relative z-10 w-500 max-w-4xl mx-auto mt-24 px-4 py-10 rounded-3xl">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-6 lg:p-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-green-700">Admin Login</h2>
            <button
              onClick={() => onNavigate?.("info")}
              className="text-sm font-semibold text-green-600 hover:text-green-800"
            >
              ← Back
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col items-center justify-center">
              <img
                src={loginImage}
                alt="Admin"
                className="w-32 h-32 object-contain bg-white/80 rounded-full p-3 shadow-md mb-4"
              />
              <p className="text-sm text-gray-600 text-center max-w-xs">
                Secure access for authorized administrators to review claims, upload drone data, and manage farmer records.
              </p>
            </div>
            <div className="flex-[1.5]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Admin ID</label>
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter Admin ID"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter Password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg text-white ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
              <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-4 text-sm text-green-800 space-y-2">
                <h3 className="font-semibold">Admin Instructions</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use your government-issued Admin ID and password.</li>
                  <li>After logging in, review pending farmer submissions before approving.</li>
                  <li>Navigate to "Upload Drone Images" to run ML predictions on fresh imagery.</li>
                  <li>Remember to log out once your verification session is complete.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginSection;