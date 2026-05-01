import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import bgImage from "../assets/bgfarmerdashboard.png";
import signupBg from "../assets/farmerlogo.png";

const FarmerLoginSection = ({ onNavigate }) => {
  const containerRef = useRef(null);
  const [aadhar, setAadhar] = useState("");
  const [dob, setDob] = useState("");
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhar, dob }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful ✅");
        onNavigate?.("dashboard");
      } else {
        alert("❌ Invalid credentials");
      }
    } catch (error) {
      alert("❌ Server error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-white bg-opacity-85 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10 p-6 lg:p-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-green-700">Farmer Login</h2>
          <button
            onClick={() => onNavigate?.("info")}
            className="text-sm font-semibold text-green-600 hover:text-green-800"
          >
            ← Back
          </button>
        </div>
        <div className="bg-white bg-opacity-80 rounded-2xl p-6 shadow-inner">
          <div className="flex justify-center mb-4">
            <img 
              src={signupBg} 
              alt="Farmer Logo" 
              className="w-full max-w-sm h-auto object-contain"
              style={{ maxHeight: '250px', width: 'auto' }}
            />
          </div>
          <p className="text-center text-gray-700 mb-4">
            Welcome Farmer! Please enter your details to continue.
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              placeholder="Aadhar Number"
              className="w-full px-4 py-2 border rounded-lg mb-3"
              required
            />
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="DOB (DD.MM.YYYY)"
              className="w-full px-4 py-2 border rounded-lg mb-3"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => onNavigate?.("signup")}
            className="mt-4 w-full text-center text-green-700 font-medium underline"
          >
            Need an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerLoginSection;

