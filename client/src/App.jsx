import { useState } from "react";

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

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: +form.N,
          P: +form.P,
          K: +form.K,
          temperature: +form.temperature,
          humidity: +form.humidity,
          ph: +form.ph,
          rainfall: +form.rainfall,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.error) {
        setError(data.error);
      } else {
        setCrop(data.prediction);
      }
    } catch (e) {
      setLoading(false);
      setError("Server not reachable. Check if backend is running.");
    }
  };

  const ranges = {
    N: { min: 0, max: 150, unit: "ppm" },
    P: { min: 0, max: 150, unit: "ppm" },
    K: { min: 0, max: 150, unit: "ppm" },
    temperature: { min: 0, max: 50, unit: "°C" },
    humidity: { min: 0, max: 100, unit: "%" },
    ph: { min: 0, max: 14, unit: "pH" },
    rainfall: { min: 0, max: 500, unit: "mm" },
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl border border-gray-200 p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Crop Recommendation
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.keys(ranges).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">
                {field.toUpperCase()} (Range: {ranges[field].min} -{" "}
                {ranges[field].max} {ranges[field].unit})
              </label>
              <input
                type="number"
                name={field}
                value={form[field]}
                onChange={handleChange}
                min={ranges[field].min}
                max={ranges[field].max}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-green-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Predicting..." : "Get Recommendation"}
        </button>

        {error && (
          <div className="mt-4 text-center text-sm text-red-500">{error}</div>
        )}

        {crop && (
          <div className="mt-6 text-center text-green-700 text-base font-medium">
            Recommended Crop: <span className="font-semibold">{crop}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
