# Project: Intus.ai Med Tech | Author: Archi Sagvekar
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from PIL import Image, ImageEnhance
import cv2
import numpy as np
import io
import base64
import os

app = Flask(__name__)
CORS(app)

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend')

@app.route('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(FRONTEND_DIR, path)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

@app.route('/process', methods=['POST'])
def process_image():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
        
        phase = request.form.get('phase', 'arterial')
        
        image_file = request.files['image']
        image_bytes = image_file.read()
        
        image = Image.open(io.BytesIO(image_bytes))
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        if phase == 'arterial':
            processed_image = apply_arterial_phase(image)
        elif phase == 'venous':
            processed_image = apply_venous_phase(image)
        else:
            return jsonify({"error": "Invalid phase. Use 'arterial' or 'venous'"}), 400
        
        img_io = io.BytesIO()
        processed_image.save(img_io, 'PNG')
        img_io.seek(0)
        
        img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
        
        return jsonify({
            "success": True,
            "processed_image": f"data:image/png;base64,{img_base64}",
            "phase": phase
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def apply_arterial_phase(image):
    enhancer = ImageEnhance.Contrast(image)
    enhanced_image = enhancer.enhance(1.8)
    
    brightness_enhancer = ImageEnhance.Brightness(enhanced_image)
    final_image = brightness_enhancer.enhance(1.1)
    
    return final_image

def apply_venous_phase(image):
    img_array = np.array(image)
    
    blurred = cv2.GaussianBlur(img_array, (15, 15), 0)
    
    result_image = Image.fromarray(blurred)
    
    return result_image

if __name__ == '__main__':
    import os
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
