import { useState, useRef } from "react";
import axios from "axios";
import {
  Upload,
  Leaf,
  Recycle,
  Trash2,
  Lightbulb,
  Loader2,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info
} from "lucide-react";

function App() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImage = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (image) {
      URL.revokeObjectURL(image);
    }

    setFile(selected);
    setImage(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const selected = e.dataTransfer.files[0];
    if (selected && selected.type.startsWith("image/")) {
      if (image) {
        URL.revokeObjectURL(image);
      }
      setFile(selected);
      setImage(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const clearAll = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }
    setImage(null);
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeImage = async () => {
    if (!file) return alert("Please upload an image.");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setResult(null);

      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.post(
        `${apiBase}/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      let data = res.data;

      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze image. Please ensure the backend server is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to normalize and check if the waste is recyclable
  const getRecyclableStatus = (val) => {
    if (!val) return { text: "Unknown", color: "text-gray-500 bg-gray-50 border-gray-200", icon: HelpCircle };
    const s = String(val).toLowerCase();
    const isYes = s.includes("yes") || s.includes("true") || (s.includes("recyclable") && !s.includes("non"));
    if (isYes) {
      return { text: "Recyclable", color: "text-emerald-700 bg-emerald-50/80 border-emerald-200", icon: CheckCircle2 };
    }
    return { text: "Non-Recyclable", color: "text-rose-700 bg-rose-50/80 border-rose-200", icon: XCircle };
  };

  // Helper to map recommended bin to appropriate styles
  const getBinStyle = (binName) => {
    if (!binName) return { color: "bg-gray-50 text-gray-700 border-gray-200", emoji: "🗑️" };
    const name = binName.toLowerCase();
    if (name.includes("blue") || name.includes("recycle")) {
      return { color: "bg-blue-50/90 text-blue-700 border-blue-200", emoji: "🟦" };
    }
    if (name.includes("green") || name.includes("compost") || name.includes("organic")) {
      return { color: "bg-emerald-50/90 text-emerald-700 border-emerald-200", emoji: "🟩" };
    }
    if (name.includes("yellow")) {
      return { color: "bg-amber-50/90 text-amber-800 border-amber-200", emoji: "🟨" };
    }
    if (name.includes("red") || name.includes("hazard")) {
      return { color: "bg-red-50/90 text-red-700 border-red-200", emoji: "🟥" };
    }
    return { color: "bg-zinc-50/90 text-zinc-700 border-zinc-200", emoji: "🗑️" };
  };

  const recyclableBadge = result ? getRecyclableStatus(result.recyclable) : null;
  const RecyclableIcon = recyclableBadge ? recyclableBadge.icon : HelpCircle;
  const binStyle = result ? getBinStyle(result.bin) : null;

  return (
    <div className="min-h-screen bg-radial from-emerald-50/40 via-green-50/60 to-emerald-100/40 font-sans text-slate-800 p-4 md:p-8 lg:p-12 flex flex-col items-center">
      
      {/* Header Banner */}
      <header className="w-full max-w-6xl flex flex-col items-center text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-3.5 bg-emerald-500/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-emerald-500/20 shadow-xs mb-4 animate-bounce-slow">
          <Leaf className="text-emerald-600 animate-pulse" size={24} />
          <span className="text-emerald-800 font-semibold tracking-wide text-sm md:text-base">EcoSort AI Assistant</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 tracking-tight">
          Smart Waste Segregation
        </h1>
        <p className="text-slate-600 mt-3 text-base md:text-lg max-w-xl font-medium">
          Upload an image of any waste item. Our AI analyzes the material, categorizes it, and tells you exactly which bin it belongs to.
        </p>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-6xl">
        <div className={`grid gap-8 transition-all duration-500 ${result ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1 max-w-2xl mx-auto"}`}>
          
          {/* Left Column: Image Upload & Preview */}
          <section className={`transition-all duration-500 ${result ? "lg:col-span-5" : "w-full"}`}>
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-emerald-500/5 border border-emerald-50/50 p-6 md:p-8 flex flex-col h-full hover:shadow-2xl hover:shadow-emerald-500/8 transition-all duration-300">
              
              {!image ? (
                /* Dropzone Area */
                <label
                  id="waste-dropzone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex-1 min-h-[300px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 group ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-50/80 scale-[1.01]"
                      : "border-emerald-300/80 bg-emerald-50/30 hover:border-emerald-500 hover:bg-emerald-50/50"
                  }`}
                >
                  <div className="bg-white rounded-full p-5 shadow-md border border-emerald-100 group-hover:scale-110 transition-transform duration-300">
                    <Upload size={40} className="text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold mt-5 text-slate-800">
                    Upload Waste Image
                  </h2>
                  <p className="text-slate-500 mt-2 text-sm max-w-xs leading-relaxed">
                    Drag and drop your image here, or <span className="text-emerald-600 font-semibold underline decoration-2 decoration-emerald-200">browse file</span> from your device
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-emerald-100 text-emerald-800">PNG</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-emerald-100 text-emerald-800">JPG</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-emerald-100 text-emerald-800">WEBP</span>
                  </div>
                  <input
                    id="waste-file-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImage}
                  />
                </label>
              ) : (
                /* Image Preview Mode */
                <div className="flex-1 flex flex-col justify-between">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-50 group">
                    <img
                      src={image}
                      alt="waste preview"
                      className="w-full h-80 object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-xs font-semibold bg-emerald-600 px-3 py-1 rounded-full">{file?.name}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      id="btn-clear-waste"
                      onClick={clearAll}
                      className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-rose-200 hover:bg-rose-50/50 hover:text-rose-700 transition-all duration-200 py-3.5 rounded-xl font-bold text-slate-600 text-sm active:scale-[0.98]"
                    >
                      <RefreshCw size={16} />
                      Reset
                    </button>
                    <button
                      id="btn-analyze-waste"
                      onClick={analyzeImage}
                      disabled={loading}
                      className="flex-[2] flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 transition-all duration-200 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-600/10 active:scale-[0.98]"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Analyze Waste
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Loading or Results */}
          <section className={`transition-all duration-500 ${result ? "lg:col-span-7 block" : loading ? "block" : "hidden"}`}>
            
            {/* Loading Indicator */}
            {loading && (
              <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-emerald-50 p-12 flex flex-col items-center justify-center h-full shadow-xl shadow-emerald-500/5 min-h-[350px]">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-20 h-20 rounded-full border-4 border-emerald-100 animate-ping"></div>
                  <Loader2 size={64} className="animate-spin text-emerald-600 relative z-10" />
                </div>
                <h3 className="mt-8 text-xl font-extrabold text-slate-800 tracking-tight">AI Analysis In Progress</h3>
                <p className="mt-2 text-slate-500 text-sm text-center max-w-xs">
                  Scanning image features, identifying materials, and generating segregation guidelines...
                </p>
              </div>
            )}

            {/* Results Output */}
            {result && (
              <div id="waste-analysis-results" className="bg-white rounded-3xl shadow-xl shadow-emerald-500/5 border border-slate-100/50 p-6 md:p-8 flex flex-col justify-between h-full hover:shadow-2xl hover:shadow-emerald-500/8 transition-all duration-300 animate-fadeIn">
                <div>
                  {/* Result Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                        <Sparkles className="text-emerald-700" size={22} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">AI Analysis</h2>
                        <p className="text-xs text-slate-400 font-medium">EcoSort Engine v2.5</p>
                      </div>
                    </div>
                    {recyclableBadge && (
                      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${recyclableBadge.color}`}>
                        <RecyclableIcon size={14} />
                        {recyclableBadge.text}
                      </span>
                    )}
                  </div>

                  {/* Result Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Waste Item */}
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-xs text-slate-700">
                        <Trash2 size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identified Item</span>
                        <h4 className="font-extrabold text-slate-800 text-lg mt-0.5">{result.waste || "Unknown Material"}</h4>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-xs text-slate-700">
                        <Recycle size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Waste Category</span>
                        <h4 className="font-extrabold text-slate-800 text-lg mt-0.5">{result.category || "General waste"}</h4>
                      </div>
                    </div>

                    {/* Recommended Bin */}
                    <div className={`col-span-1 md:col-span-2 border p-5 rounded-2xl flex items-center justify-between ${binStyle?.color || "bg-slate-50 text-slate-700"}`}>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl leading-none">{binStyle?.emoji || "🗑️"}</span>
                        <div>
                          <span className="text-xs font-bold opacity-60 uppercase tracking-wider">Recommended Disposal Bin</span>
                          <h4 className="font-black text-xl leading-tight mt-0.5">{result.bin || "Landfill Bin"}</h4>
                        </div>
                      </div>
                      <span className="text-xs font-semibold bg-white/70 px-3 py-1 rounded-full border border-black/5 shadow-xs">Segregate Here</span>
                    </div>

                  </div>
                </div>

                {/* Recycling Tip Section */}
                <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-5 mt-6 flex gap-4 items-start shadow-xs">
                  <div className="bg-white p-2 rounded-xl shadow-xs border border-amber-100 text-amber-600 mt-0.5">
                    <Lightbulb size={20} className="fill-amber-50 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="font-bold text-amber-900 text-sm">Recycling & Handling Tip</h5>
                    <p className="text-amber-800 text-sm mt-1 leading-relaxed font-medium">
                      {result.tip || "No additional handling tip specified. Please segregate carefully."}
                    </p>
                  </div>
                </div>

              </div>
            )}
          </section>
        </div>
      </main>

      {/* Info Section / Footer */}
      <footer className="w-full max-w-6xl mt-12 md:mt-16 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
        <div className="flex items-center gap-2">
          <Info size={14} className="text-slate-300" />
          <span>Sorting rules and bin designations may vary based on local recycling facilities.</span>
        </div>
        <div>
          <span>&copy; {new Date().getFullYear()} EcoSort AI. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}

export default App;