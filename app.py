from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

@app.route('/helloWorld', methods=["POST"])
def helloWorld():
    requestBody = request.get_json()
    return 'Hello ' + requestBody["firstName"] + " " + requestBody["lastName"] 

