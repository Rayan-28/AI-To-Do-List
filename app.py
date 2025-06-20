from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

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
