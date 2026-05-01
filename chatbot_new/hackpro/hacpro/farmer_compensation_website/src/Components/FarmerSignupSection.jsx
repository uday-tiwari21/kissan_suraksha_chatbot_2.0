import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
//import signupBg from "../assets/farmerlogo.png";
import authimage from "../assets/adhaarlogo.png";

const FarmerSignupSection = ({ onNavigate }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [dob, setDob] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);

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

  const handleGetOtp = async (e) => {
    e.preventDefault();
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(aadhaar)) {
      alert("Invalid Aadhaar! Must be exactly 12 digits.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/auth/signup/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhar: aadhaar, dob }),
      });
      const data = await res.json();
      if (data.otp !== undefined) {
        setShowOtpForm(true);
        setOtp("");
        alert(`OTP generated! ✅ Your OTP is: ${data.otp}`);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Server error: " + error.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/signup/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhar: aadhaar, dob, otp }),
      });
      const data = await res.json();
      if (res.ok || res.status === 200) {
        alert("Signup successful ✅");
        onNavigate?.("login");
      } else {
        alert("Failed ❌ " + data.message);
      }
    } catch (error) {
      alert("Server error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative  bg-white bg-opacity-85 backdrop-blur-md rounded-3xl shadow-2xl p-6 lg:p-6 h-[800px] w-[700px] mx-auto"
    >
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-3xl font-bold text-green-700">Farmer Signup</h2>
        <button
          onClick={() => onNavigate?.("info")}
          className="text-sm font-semibold text-green-600 hover:text-green-800"
        >
          ← Back
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
     
        <div className="flex-1">
          <p className="text-gray-600 mb-4">Enter Aadhaar & DOB, then verify OTP to register.</p>
          <img src={authimage} alt="Aadhaar" className="w-full max-w-sm mx-auto mb-6 object-contain" />

          {!showOtpForm ? (
            <form onSubmit={handleGetOtp}>
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="Enter Aadhaar Number"
                className="w-full px-4 py-3 border rounded-lg mb-4"
                required
              />
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="Enter DOB (dd.mm.yyyy)"
                className="w-full px-4 py-3 border rounded-lg mb-4"
                required
              />
              <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 mb-3">
                Get OTP
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("login")}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
              >
                Go to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-4 py-3 border rounded-lg mb-4"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerSignupSection;

