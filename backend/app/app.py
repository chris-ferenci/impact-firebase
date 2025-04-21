from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from openai import OpenAI
from dotenv import load_dotenv
import os
import tiktoken  # OpenAI tokenizer library

# Load environment variables from .env file
load_dotenv(override=True)

app = Flask(__name__)
CORS(app)

print("OpenAI Key:", os.getenv("OPENAI_API_KEY"))

# Configure OpenAI client using the API key from the environment variable
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

client = OpenAI(api_key=openai_api_key)

# Load your custom API key (for protecting the API)
master_key = os.getenv("MASTER_KEY")
if not master_key:
    raise ValueError("MASTER_KEY environment variable is not set")

# The protected API key required for normal /summarize usage
required_api_key = os.getenv('API_KEY')

def verify_api_key():
    provided_key = request.headers.get('x-api-key') or request.args.get('api_key')
    return provided_key == required_api_key

def verify_master_key():
    # This is for the admin endpoint that creates new API keys
    provided_master_key = request.headers.get('x-master-key') or request.args.get('master_key')
    return provided_master_key == master_key

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
    # Verify API key (for normal API usage)
    if not verify_api_key():
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.json
    job_description = data.get('jobDescription', '')
    # print(data)

    if not job_description:
        return jsonify({'error': 'No job description provided'}), 400

    try:
        # Use the OpenAI client to create a chat completion
        completion = client.chat.completions.create(
            model="gpt-4.1",  # Use the appropriate model (e.g., "gpt-4" or "gpt-3.5-turbo")
            messages=[
                {"role": "system", 
                 "content": """
                    You are a recruiting‐domain assistant.  
                    When given a job description, produce:

                    1. **Overview**: 3–4 sentence paragraph summarizing the role’s purpose.  
                    2. **Key Responsibilities**: 3–5 bullet points.  
                    3. **Qualifications**: 3–5 bullet points.  
                    4. **Salary**: single bullet if a salary is mentioned; otherwise “Not specified.”  
                    5. **Location**: single bullet if a location is mentioned; otherwise “Remote or unspecified.”

                    Always format exactly as Markdown, with headings and bullets.  
                    Be concise, factual, and use professional tone.
                    """},
                {"role": "user", 
                 "content": f"""Here is the full job description: {job_description} Please follow the above structure exactly."""}
            ]
        )
        # Extract the summarized content
        summary = completion.choices[0].message.content.strip()
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)