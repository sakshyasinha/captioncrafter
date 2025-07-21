from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
API_KEY = os.getenv("GROQ_API_KEY")

# Check if API key loaded
if not API_KEY:
    raise ValueError("❌ GROQ_API_KEY not found in environment variables. Make sure your .env file is correctly set.")

# BLIP model for image-to-text
blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

API_URL = "https://api.groq.com/openai/v1/chat/completions"

def generate_image_description(image_path):
    image = Image.open(image_path).convert("RGB")
    inputs = blip_processor(image, return_tensors="pt")
    output = blip_model.generate(**inputs)
    description = blip_processor.decode(output[0], skip_special_tokens=True)
    print("🟦 BLIP Description:", description)
    return description

def generate_caption(description, tone="witty"):
    prompt = f"Write a {tone} social media caption for this image: \"{description}\""

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",  # ✅ updated
        "messages": [
            {"role": "system", "content": "You are a creative assistant that writes engaging and witty social media captions."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.9,
        "max_tokens": 60,
        "top_p": 0.95
    }

    response = requests.post(API_URL, headers=headers, json=payload)
    
    try:
        response.raise_for_status()
        caption = response.json()["choices"][0]["message"]["content"].strip()
        return caption
    except Exception as e:
        print("❌ Error generating caption:", e)
        print("🔴 API Response:", response.text)
        return "Error generating caption."
