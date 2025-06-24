import { useState } from "react";

const ranges = {
  N: { min: 0, max: 150, unit: "ppm" },
  P: { min: 0, max: 150, unit: "ppm" },
  K: { min: 0, max: 150, unit: "ppm" },
  temperature: { min: 0, max: 50, unit: "°C" },
  humidity: { min: 0, max: 100, unit: "%" },
  ph: { min: 0, max: 14, unit: "pH" },
  rainfall: { min: 0, max: 500, unit: "mm" },
};

function App() {
  const [form, setForm] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setCrop(null);
    setLoading(true);
    const API_URL = "https://crop-recommedation-7kme.onrender.com";

    try {
      const res = await fetch(`${API_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(form).map(([key, val]) => [key, +val])
          )
        ),
      });

      const data = await res.json();
      setLoading(false);
      if (data.error) setError(data.error);
      else setCrop(data.prediction);
    } catch (e) {
      setLoading(false);
      setError("Server not reachable. Check if backend is running.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl border border-gray-300 shadow-md rounded-2xl p-8 bg-gray-50">
        <h1 className="text-2xl font-bold text-center mb-6">
          🌾 Crop Recommendation
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(ranges).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">
                {key.toUpperCase()} ({ranges[key].min}–{ranges[key].max}{" "}
                {ranges[key].unit})
              </label>
              <input
                type="number"
                name={key}
                value={form[key]}
                min={ranges[key].min}
                max={ranges[key].max}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Predicting..." : "Get Recommendation"}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-600 text-sm">{error}</p>
        )}

        {crop && (
          <p className="mt-6 text-center text-green-700 font-semibold text-lg">
            🌱 Recommended Crop: <span className="underline">{crop}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
