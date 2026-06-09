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

print("Loading Summarizer...")
summary_pipeline = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6"
)
print("Summarizer Loaded!")

class TextInput(BaseModel):
    text: str

@app.get("/")
def home():
    return {
        "message": "FinSight ML Service Running"
    }

@app.post("/sentiment")
def analyze_sentiment(data: TextInput):
    result = sentiment_pipeline(data.text)
    return result

@app.post("/summary")
def summarize_text(data: TextInput):
    text = data.text[:3500]

    result = summary_pipeline(
        text,
        max_length=120,
        min_length=40,
        do_sample=False
    )

    return {
        "summary": result[0]["summary_text"]
    }