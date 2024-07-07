from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

classifier = pipeline("text-classification", model="irlab-udc/MetaHateBERT")

@app.route('/classify', methods=['POST'])
def classify_text():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    result = classifier(text)
    print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=7000, debug=True)