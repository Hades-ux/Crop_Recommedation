# ------------------------
# Backend: app.py (with absolute model path)
# ------------------------

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import warnings
import os

app = Flask(__name__)
CORS(app)

# Load the trained model using absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'model.pkl')
model = pickle.load(open(model_path, 'rb'))

@app.route('/', methods=['GET'])
def health():
    return jsonify({"status": "Crop prediction API running ✅"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Input validation
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        # Convert to DataFrame to preserve feature names
        input_df = pd.DataFrame([{
            'N': data['N'],
            'P': data['P'],
            'K': data['K'],
            'temperature': data['temperature'],
            'humidity': data['humidity'],
            'ph': data['ph'],
            'rainfall': data['rainfall']
        }])

        # Predict with warning suppression
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            prediction = model.predict(input_df)[0]

        return jsonify({'prediction': prediction})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
