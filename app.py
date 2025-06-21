import cohere
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load ML model
model = joblib.load("task_priority_model.pkl")

# Initialize Cohere
cohere_client = cohere.Client("zZi5aALASaYpZ1iZGU0NwjL5UMu8f23t8qAAQ5Iz")  # Replace with your actual key

# ----------------- Routes -----------------

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

@app.route('/suggest', methods=['POST'])
def suggest():
    data = request.get_json()
    task = data.get('task', '')

    if not task:
        return jsonify({"error": "No task provided"}), 400

    prompt = (
        f"Given the main task: '{task}', suggest 3 short, actionable subtasks. "
        "Each subtask should be simple, one line only, and not repeat the main task. Format:\n"
        "1. [First subtask]\n2. [Second subtask]\n3. [Third subtask]"
    )

    try:
        response = cohere_client.generate(
            model='command-light',
            prompt=prompt,
            max_tokens=40,
            temperature=0.3,
            stop_sequences=["\n\n"]
        )

        raw_output = response.generations[0].text.strip()
        lines = raw_output.split("\n")
        suggestions = []

        for line in lines:
            cleaned = line.strip("-•1234567890. ").strip()
            if cleaned:
                suggestions.append(cleaned)

        return jsonify({"suggestions": suggestions[:3]})
    except Exception as e:
        return jsonify({"error": f"Generation failed: {str(e)}"}), 500


# ----------------- Run Server -----------------
if __name__ == '__main__':
    app.run(debug=True)
