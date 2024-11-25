from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from openai import OpenAI
import tiktoken  # OpenAI tokenizer library


app = Flask(__name__)
cors = CORS(app)

# Configure OpenAI client
client = OpenAI(api_key='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')  # Replace with your actual API key

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
    print(data)

    if not job_description:
        return jsonify({'error': 'No job description provided'}), 400

    try:
        # Use the OpenAI client to create a chat completion
        completion = client.chat.completions.create(
            model="gpt-4o-mini",  # Use the appropriate model (e.g., "gpt-4" or "gpt-3.5-turbo")
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Summarize the following job description in one 3-4 sentence paragraph. If you see a salary, add it as a bulletpoint:\n{job_description}"}
            ]
        )
        # Extract the summarized content
        summary = completion.choices[0].message.content.strip()
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)