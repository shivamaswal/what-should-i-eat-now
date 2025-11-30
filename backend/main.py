from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import engine, get_db, Base
from models import FoodItem
from schemas import (
    QuizAnswers, 
    FoodItemResponse, 
    RecommendationResponse, 
    RecommendationWithScore,
    HealthResponse
)
from recommendation import get_recommendations, get_random_fallback

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="What Should I Eat Now? API",
    description="Food recommendation API based on quiz answers",
    version="1.0.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthResponse)
def root():
    return {
        "status": "ok",
        "message": "What Should I Eat Now? API is running!",
        "database": "connected"
    }


@app.get("/api/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    try:
        count = db.query(FoodItem).count()
        return {
            "status": "ok",
            "message": f"API healthy. {count} food items in database.",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "database": "disconnected"
        }


@app.get("/api/foods", response_model=List[FoodItemResponse])
def get_all_foods(
    cuisine: str = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(FoodItem)
    if cuisine:
        query = query.filter(FoodItem.cuisine == cuisine.lower())
    foods = query.limit(limit).all()
    return foods


@app.get("/api/foods/{food_id}", response_model=FoodItemResponse)
def get_food_by_id(food_id: int, db: Session = Depends(get_db)):
    food = db.query(FoodItem).filter(FoodItem.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")
    return food


@app.post("/api/recommend", response_model=RecommendationResponse)
def get_recommendation(answers: QuizAnswers, db: Session = Depends(get_db)):
    recommendations = get_recommendations(db, answers, limit=3)
    
    if not recommendations:
        fallback = get_random_fallback(db)
        if fallback:
            return {
                "best_match": FoodItemResponse.model_validate(fallback.to_dict()),
                "score": 0.0,
                "matched_tags": [],
                "alternatives": [],
                "total_matches": 0
            }
        else:
            raise HTTPException(
                status_code=404, 
                detail="No food items found. Please seed the database."
            )
    
    best_food, best_score, best_tags = recommendations[0]
    
    alternatives = [
        RecommendationWithScore(
            food=FoodItemResponse.model_validate(food.to_dict()),
            score=score,
            matched_tags=tags
        )
        for food, score, tags in recommendations[1:]
    ]
    
    return {
        "best_match": FoodItemResponse.model_validate(best_food.to_dict()),
        "score": best_score,
        "matched_tags": best_tags,
        "alternatives": alternatives,
        "total_matches": len(recommendations)
    }


@app.get("/api/cuisines")
def get_cuisines(db: Session = Depends(get_db)):
    cuisines = db.query(FoodItem.cuisine).distinct().all()
    return {"cuisines": [c[0] for c in cuisines]}


@app.on_event("startup")
async def startup_event():
    print("Starting What Should I Eat Now? API...")
    db = next(get_db())
    count = db.query(FoodItem).count()
    if count == 0:
        print("Database is empty. Running seed...")
        from seed_data import seed_database
        seed_database()
    else:
        print(f"Database has {count} food items.")
    db.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

