import json
import os
import requests
import sys
from urllib.request import Request, urlopen
from pymongo import MongoClient
from flask import Flask, request

app = Flask(__name__)

def get_db_connection():
  client = MongoClient(os.environ['MONGODB_URI'])
  if os.environ["IS_PRODUCTION"].lower() == "true":
    return client.heroku_0hcp48pq
  return client.heroku_j9g2w0v4

# Webhook for all requests
@app.route("/hello", methods=["POST"])
def hello():
  return "hello"