import { useState } from "react";
import axios from "axios";
import {
  Upload,
  Leaf,
  Recycle,
  Trash2,
  Lightbulb,
  Loader2,
} from "lucide-react";

function App() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImage = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setImage(URL.createObjectURL(selected));
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!file) return alert("Please upload an image.");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:5000/analyze",
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
      console.log(err);
      alert("Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 flex flex-col items-center p-10">

      <div className="flex items-center gap-3">
        <Leaf size={40} className="text-green-700" />
        <h1 className="text-5xl font-bold text-green-700">
          EcoSort AI
        </h1>
      </div>

      <p className="text-gray-700 mt-3 text-lg">
        AI Powered Waste Segregator
      </p>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mt-10 w-full max-w-xl">

        <label className="border-2 border-dashed border-green-500 rounded-2xl flex flex-col items-center justify-center p-12 cursor-pointer hover:bg-green-50 transition">

          <Upload size={60} className="text-green-600" />

          <h2 className="text-xl font-semibold mt-4">
            Upload Waste Image
          </h2>

          <p className="text-gray-500 mt-2">
            Click to browse
          </p>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />
        </label>

        {image && (
          <img
            src={image}
            alt="preview"
            className="rounded-2xl mt-6 w-full h-72 object-cover shadow-lg"
          />
        )}

        <button
          onClick={analyzeImage}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 transition text-white py-4 rounded-xl text-lg font-semibold shadow-lg"
        >
          Analyze Waste
        </button>
      </div>

      {loading && (
        <div className="mt-8 flex flex-col items-center">

          <Loader2
            size={50}
            className="animate-spin text-green-700"
          />

          <p className="mt-4 text-lg font-semibold">
            AI is analyzing your image...
          </p>

        </div>
      )}

      {result && (
        <div className="bg-white rounded-3xl shadow-2xl p-8 mt-10 w-full max-w-xl">

          <h2 className="text-3xl font-bold text-green-700 mb-6">
            AI Analysis
          </h2>

          <div className="grid gap-5">

            <div className="bg-green-50 rounded-xl p-5 flex items-center gap-4">

              <Trash2 className="text-green-700" />

              <div>

                <h3 className="font-bold">Waste</h3>

                <p>{result.waste}</p>

              </div>

            </div>

            <div className="bg-green-50 rounded-xl p-5 flex items-center gap-4">

              <Recycle className="text-green-700" />

              <div>

                <h3 className="font-bold">Category</h3>

                <p>{result.category}</p>

              </div>

            </div>

            <div className="bg-green-50 rounded-xl p-5">

              <h3 className="font-bold">
                🟦 Bin
              </h3>

              <p>{result.bin}</p>

            </div>

            <div className="bg-green-50 rounded-xl p-5">

              <h3 className="font-bold">
                ✅ Recyclable
              </h3>

              <p>{result.recyclable}</p>

            </div>

            <div className="bg-yellow-50 rounded-xl p-5 flex items-center gap-4">

              <Lightbulb className="text-yellow-600" />

              <div>

                <h3 className="font-bold">
                  Recycling Tip
                </h3>

                <p>{result.tip}</p>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;