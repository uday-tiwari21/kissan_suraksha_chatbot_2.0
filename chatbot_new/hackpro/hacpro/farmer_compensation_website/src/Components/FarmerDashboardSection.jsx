import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { gsap } from "gsap";
import farmerdashboardbg from "../assets/bgfarmerdashboard.png";
import logo from "../assets/logo.jpg";

const emptyForm = {
  name: "",
  landReg: "",
  city: "",
  state: "",
  reason: "",
  images: [],
};

const FarmerDashboardSection = ({ onNavigate }) => {
  const containerRef = useRef(null);
  const [formData, setFormData] = useState(emptyForm);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      onNavigate?.("login");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/dashboard/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.name || "",
            landReg: data.landReg || "",
            city: data.city || "",
            state: data.state || "",
            reason: data.reason || "",
            images: [],
          });
        } else if (res.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          onNavigate?.("login");
        } else {
          alert("❌ " + data.message);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, [onNavigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 4) {
      alert("Max 4 images allowed");
      return;
    }
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleRemoveImage = (idx) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== idx),
    });
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        onNavigate?.("login");
        return;
      }
      const base64Images = await Promise.all(formData.images.map(convertToBase64));
      const res = await fetch("http://localhost:5000/dashboard/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, images: base64Images }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Data saved successfully!");
        setFormData(emptyForm);
        localStorage.removeItem("token");
        onNavigate?.("info");
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      alert("❌ Server error: " + err.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onNavigate?.("info");
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-3xl shadow-2xl overflow-hidden"
      style={{
        backgroundImage: `url(${farmerdashboardbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10">
        <div className="w-full h-20 bg-gray-50 backdrop-blur-sm shadow-md py-4 px-6 flex items-center relative">
          <button
            onClick={handleLogout}
            className="absolute left-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Logout
          </button>
          <img
            src={logo}
            alt="Website Logo"
            className="mix-blend-multiply h-16 absolute left-1/2 transform -translate-x-1/2"
          />
        </div>
        <div className="p-6 lg:p-10">
          <div className="w-full max-w-3xl mx-auto bg-white/90 shadow-xl rounded-2xl p-8 backdrop-blur-md">
            <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">Farmer Dashboard</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Land Registration No.</label>
                <input
                  type="text"
                  name="landReg"
                  value={formData.landReg}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Reason for Crop Damage</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
                  placeholder="Explain the reason for crop damage..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Upload Crop Images (Max 4)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded-lg"
                />
                <div className="flex gap-3 mt-3 flex-wrap">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden shadow">
                      <img src={URL.createObjectURL(img)} alt="crop" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg text-white ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Saving..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboardSection;

