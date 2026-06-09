from fastapi import FastAPI
from transformers import pipeline
from pydantic import BaseModel

app = FastAPI()

print("Loading FinBERT...")

sentiment_pipeline = pipeline(
    "text-classification",
    model="ProsusAI/finbert"
)

print("FinBERT Loaded!")

class TextInput(BaseModel):
    text: str

@app.post("/sentiment")
def analyze_sentiment(data: TextInput):
    result = sentiment_pipeline(data.text)
    return result

@app.get("/")
def home():
    return {
        "message": "FinSight ML Service Running"
    }