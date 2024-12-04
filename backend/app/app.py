from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from openai import OpenAI
from dotenv import load_dotenv
import os
import tiktoken  # OpenAI tokenizer library

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI client using the API key from the environment variable
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

client = OpenAI(api_key=openai_api_key)

# Health Check Endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "API is running"}), 200

# Function to calculate token count
def count_tokens(model, messages):
    """Calculate the total token count for the messages."""
    encoding = tiktoken.encoding_for_model(model)
    num_tokens = 0
    for message in messages:
        num_tokens += len(encoding.encode(message['content']))
    return num_tokens

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    job_description = data.get('jobDescription', '')
    # print(data)

    if not job_description:
        return jsonify({'error': 'No job description provided'}), 400

    try:
        # Use the OpenAI client to create a chat completion
        completion = client.chat.completions.create(
            model="gpt-4o-mini",  # Use the appropriate model (e.g., "gpt-4" or "gpt-3.5-turbo")
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Summarize the following job description in one 3-4 sentence paragraph. If you find see a salary, add it as a bulletpoint:\n{job_description}"}
            ]
        )
        # Extract the summarized content
        summary = completion.choices[0].message.content.strip()
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)