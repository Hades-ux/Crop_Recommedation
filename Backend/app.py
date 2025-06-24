# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import warnings
import os

# Initialize app
app = Flask(__name__)
CORS(app)

# Load model using absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
except Exception as e:
    raise RuntimeError(f"Model not found or failed to load: {e}")

# Health check
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Crop prediction API running ✅"})

# Predict route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Validate input
        expected_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        for field in expected_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Prepare data
        input_df = pd.DataFrame([{k: data[k] for k in expected_fields}])

        # Make prediction
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            prediction = model.predict(input_df)[0]

        return jsonify({"prediction": prediction})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run locally (not used on Render)
if __name__ == "__main__":
    app.run()
