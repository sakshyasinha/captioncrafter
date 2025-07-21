from flask import Flask, request, jsonify
from flask_cors import CORS
from caption_generator import generate_image_description, generate_caption
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # 👈 This allows requests from frontend

UPLOAD_FOLDER = "static"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route("/generate-caption", methods=["POST"])
def generate():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    tone = request.form.get("tone", "witty")

    filename = secure_filename(file.filename)
    image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(image_path)

    try:
        description = generate_image_description(image_path)
        caption = generate_caption(description, tone)
        return jsonify({"caption": caption})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=5000)
