from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from PIL import Image
import io

# --- KONFIGURACJA ---
app = Flask(__name__)

# Pamiętaj o kluczu API
API_KEY = "..."
MODEL_NAME = 'gemini-2.5-flash'

genai.configure(api_key=API_KEY)


# --- ROUTING ---

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze_car():
    if 'image' not in request.files:
        return jsonify({'error': 'Nie przesłano pliku'}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'Nie wybrano pliku'}), 400

    try:
        img = Image.open(file.stream)
        model = genai.GenerativeModel(MODEL_NAME)

        prompt = (
            "Przeanalizuj to zdjęcie. Zidentyfikuj widoczny na nim samochód. "
            "Odpowiedz krótko w formacie HTML (bez znaczników ```html). "
            "Użyj tagów <strong> dla etykiet. "
            "Format:\n"
            "<p><strong>Marka:</strong> [Marka]</p>\n"
            "<p><strong>Model:</strong> [Model]</p>\n"
            "<p><strong>Rocznik:</strong> [Przybliżony rok]</p>\n"
            "<p><strong>Ciekawostka:</strong> [Krótka cecha szczególna]</p>"
        )

        response = model.generate_content([prompt, img])
        return jsonify({'result': response.text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)