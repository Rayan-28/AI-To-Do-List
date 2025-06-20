from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load your trained model
model = joblib.load("task_priority_model.pkl")

@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    task_text = data.get('task', '')

    if not task_text:
        return jsonify({'error': 'No task provided'}), 400

    prediction = model.predict([task_text])[0]
    return jsonify({'priority': prediction})

if __name__ == '__main__':
    app.run(debug=True)
