import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Upload, LogOut, Search } from "lucide-react";
import axios from "axios";
import { jsPDF } from "jspdf";

const AdminUploadImage = () => {
  const navigate = useNavigate();

  const [aadhar, setAadhar] = useState("");
  const [images, setImages] = useState([]);
  const [farmerData, setFarmerData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "auto";
  }, [loading]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!aadhar) return alert("Please enter Aadhaar number");

    const cleanAadhar = aadhar.trim().replace(/\D/g, "");
    if (cleanAadhar.length !== 12)
      return alert("Aadhaar number must be 12 digits");

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/farmer/${cleanAadhar}`
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Error" }));
        alert(err.message);
        setFarmerData(null);
        return;
      }

      const data = await res.json();
      setFarmerData({
        ...data,
        name: data.name || "",
        city: data.city || "",
        state: data.state || "",
        landReg: data.landReg || "",
        reason: data.reason || "",
      });
    } catch (error) {
      alert("Server error: " + error.message);
      setFarmerData(null);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5)
      return alert("Max 5 images allowed.");
    setImages([...images, ...files]);
  };

  const handleRemoveImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handlePrediction = async () => {
    if (images.length === 0)
      return alert("Please upload at least one drone image.");

    const formData = new FormData();
    formData.append("image", images[0]);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/run-ml",
        formData
      );

      setPrediction(res.data);
    } catch (err) {
      alert("Error running ML model");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------
       UNICODE HANDLING HELPERS
  -------------------------------*/

  const containsUnicode = (text) => {
    if (!text) return false;
    return /[\u0900-\u097F\u0C00-\u0C7F\u0980-\u09FF]/.test(text);
  };

  const waitForFonts = async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise((res) => setTimeout(res, 600));
  };

  const addUnicodeText = async (doc, text, x, y, fontSize = 12, maxWidth = 80) => {
    if (!containsUnicode(text)) {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return lines.length * 6;
    }

    try {
      await waitForFonts();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const scale = 5;
      const mmToPx = 3.78;

      const actualFontSize = fontSize * 1.3;
      const canvasWidth = maxWidth * mmToPx * scale;

      ctx.font = `${actualFontSize * scale}px "Noto Sans Devanagari", "Noto Sans Telugu", sans-serif`;
      const words = text.split(/\s+/);
      let lines = [];
      let current = "";

      for (const w of words) {
        const test = current ? current + " " + w : w;
        if (ctx.measureText(test).width > canvasWidth) {
          lines.push(current);
          current = w;
        } else current = test;
      }
      if (current) lines.push(current);

      const lineHeight = actualFontSize * scale * 1.6;
      const padding = actualFontSize * scale;
      const canvasHeight = lines.length * lineHeight + padding * 2;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#000";
      ctx.font = `${actualFontSize * scale}px "Noto Sans Devanagari", "Noto Sans Telugu", sans-serif`;

      lines.forEach((line, i) => {
        ctx.fillText(line, padding, padding + i * lineHeight);
      });

      const img = canvas.toDataURL("image/png", 1.0);
      const imgHeight = canvasHeight / (scale * mmToPx);

      doc.addImage(img, "PNG", x, y, maxWidth, imgHeight);
      return imgHeight;
    } catch {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return lines.length * 6;
    }
  };

  /* -----------------------------------
        UPDATED addDetail() FUNCTION
  -------------------------------------*/

  const handleGeneratePDF = async () => {
    if (!farmerData) return alert("Fetch farmer details first.");
    if (!prediction) return alert("Run prediction first.");

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const leftX = 15;
      let y = 40;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Farmer Damage Report", pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(16);
      doc.text("Farmer Details:", leftX, y);
      y += 12;

      const addDetail = async (label, value) => {
        const unicode = containsUnicode(value);

        // First, render the label to get its width
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        const labelText = `${label}:`;
        doc.text(labelText, leftX, y);
        
        // Calculate label width and position value right after it with small gap
        const labelWidth = doc.getTextWidth(labelText);
        const valueX = leftX + labelWidth + 5; // 5mm gap after label

        let height;

        if (unicode) {
          // For Unicode text, use larger font and proper alignment
          height = await addUnicodeText(doc, value || "N/A", valueX, y, 26, pageWidth - valueX - 15);
        } else {
          // For regular text (English/numbers)
          doc.setFont("helvetica", "normal");
          doc.setFontSize(13);
          const lines = doc.splitTextToSize(value || "N/A", pageWidth - valueX - 15);
          doc.text(lines, valueX, y);
          height = lines.length * 7;
        }

        y += Math.max(height, 10) + 4;
      };

      await addDetail("Aadhar", aadhar);
      await addDetail("Name", farmerData.name);
      await addDetail("City", farmerData.city);
      await addDetail("State", farmerData.state);
      await addDetail("Land Reg. No", farmerData.landReg);
      await addDetail("Reason", farmerData.reason);

      y += 10;

      doc.setFont("helvetica", "bold");
      doc.text("Prediction Result:", leftX, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.text(`Damage Percentage: ${prediction.damage_percent}%`, leftX, y);
      y += 15;

      // Helper function to convert image URL or File to base64
      const toBase64 = async (urlOrFile) => {
        try {
          // If it's a File object, read it directly
          if (urlOrFile instanceof File) {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(urlOrFile);
            });
          }
          // If it's a URL string, fetch it
          const blob = await fetch(urlOrFile).then(res => res.blob());
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.error("Error converting image to base64:", err);
          throw err;
        }
      };

      // Calculate right side position for images
      const midLine = pageWidth / 2;
      const rightX = midLine + 10; // Start images 10mm after the middle line
      const imageWidth = pageWidth - rightX - 15; // Full width minus margins
      const imageHeight = 50; // Fixed height for images
      let imgY = 40; // Start images at same Y as farmer details

      // Add images section on the right side
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Farm Images:", rightX, imgY);
      imgY += 12;

      // Add Original Image
      if (images.length > 0) {
        try {
          const originalImgData = await toBase64(images[0]);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("Original Image", rightX, imgY);
          imgY += 6;
          
          doc.addImage(originalImgData, "JPEG", rightX, imgY, imageWidth, imageHeight);
          imgY += imageHeight + 10;
        } catch (err) {
          console.error("Error adding original image:", err);
        }
      }

      // Add Overlay/Predicted Image
      if (prediction?.overlay_image) {
        try {
          const overlayImgData = await toBase64(prediction.overlay_image);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("Predicted Damage Overlay", rightX, imgY);
          imgY += 6;
          
          doc.addImage(overlayImgData, "JPEG", rightX, imgY, imageWidth, imageHeight);
          imgY += imageHeight + 10;
        } catch (err) {
          console.error("Error adding overlay image:", err);
        }
      }

      // Add Mask Image if available
      if (prediction?.mask_image) {
        try {
          const maskImgData = await toBase64(prediction.mask_image);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("Damage Mask", rightX, imgY);
          imgY += 6;
          
          doc.addImage(maskImgData, "JPEG", rightX, imgY, imageWidth, imageHeight);
        } catch (err) {
          console.error("Error adding mask image:", err);
        }
      }

      doc.save(`Farmer_Report_${aadhar}.pdf`);
    } catch (err) {
      alert("Error generating PDF: " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-green-600">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <button
            className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-green-600"
            onClick={() => navigate("/admindashboard")}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button
            className="flex items-center gap-3 w-full text-left p-2 rounded-lg bg-green-800"
            onClick={() => navigate("/adminupload")}
          >
            <Upload size={20} /> Upload Drone Images
          </button>
        </nav>
        <div className="p-4 border-t border-green-600">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-red-600 bg-red-500"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Upload Drone Images
        </h1>

        {/* Search Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <label className="block text-lg font-medium mb-2">
            Enter Farmer Aadhaar Number
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              placeholder="Enter Aadhaar number"
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Search size={18} /> Fetch Data
            </button>
          </div>
        </div>

        {/* Farmer Details */}
        {farmerData && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Farmer Details</h2>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Name:</strong> <span className="font-normal">{farmerData.name || "N/A"}</span>
              </p>
              <p className="text-gray-700">
                <strong>City:</strong> <span className="font-normal">{farmerData.city || "N/A"}</span>
              </p>
              <p className="text-gray-700">
                <strong>State:</strong> <span className="font-normal">{farmerData.state || "N/A"}</span>
              </p>
              <p className="text-gray-700">
                <strong>Land Reg. No.:</strong> <span className="font-normal">{farmerData.landReg || "N/A"}</span>
              </p>
              <p className="text-gray-700">
                <strong>Reason:</strong> <span className="font-normal">{farmerData.reason || "N/A"}</span>
              </p>
              {farmerData.preferredLanguage && (
                <p className="text-gray-700">
                  <strong>Preferred Language:</strong>{" "}
                  <span className="font-normal">
                    {farmerData.preferredLanguage === "hi" ? "Hindi (हिंदी)" :
                     farmerData.preferredLanguage === "te" ? "Telugu (తెలుగు)" :
                     farmerData.preferredLanguage === "en" ? "English" :
                     farmerData.preferredLanguage}
                  </span>
                </p>
              )}
            </div>

            {farmerData.images && farmerData.images.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Farmer Uploaded Images:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {farmerData.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`farmer-img-${idx}`}
                      className="w-full h-40 object-cover rounded-lg shadow-md cursor-pointer"
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Image Upload Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Drone Images</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="mb-4"
          />
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`upload-${idx}`}
                    className="w-full h-40 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prediction Section */}
        {prediction && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Prediction Result</h2>
            <p className="text-lg mb-4">
              <strong>Damage Percentage:</strong> {prediction.damage_percent}%
            </p>
            {prediction.overlay_image && (
              <img
                src={prediction.overlay_image}
                alt="Overlay"
                className="w-full max-w-md rounded-lg shadow-md mb-4"
              />
            )}
            {prediction.mask_image && (
              <img
                src={prediction.mask_image}
                alt="Mask"
                className="w-full max-w-md rounded-lg shadow-md"
              />
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrediction}
            disabled={images.length === 0 || loading}
            className={`px-6 py-3 rounded-lg text-white font-semibold ${
              images.length === 0 || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Run Prediction"}
          </button>
          {prediction && farmerData && (
            <button
              onClick={handleGeneratePDF}
              className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              Generate PDF
            </button>
          )}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-4xl max-h-[90vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-center">Processing image...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUploadImage;
