from flask import Flask, request, jsonify
from flask_cors import CORS
from revChatGPT.V1 import Chatbot

app = Flask(__name__)
CORS(app)  # Enable CORS

chatbot = Chatbot(config={
    "email": "**********",
    "password": "**********",
    "model": "gpt-4-mobile",
})

@app.route('/api/gpt4', methods=['POST', 'GET'])
def chat():
    if request.method == 'POST':
        prompt = request.json['prompt']
    else:
        prompt = request.args.get('prompt')
    response = ""
    print(f"读入的prompt为{prompt}")
    for data in chatbot.ask(
            prompt
    ):
    
        response = data["message"]
    print(f"返回的response为{response}")
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(port=1145)
