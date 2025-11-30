from pydantic import BaseModel
from typing import List, Optional

# Quiz answers from frontend
class QuizAnswers(BaseModel):
    hunger: int  # 0-100
    budget: str  # broke, moderate, balling
    healthiness: int  # 0-100
    temperature: int  # 0-100
    spice: int  # 0-5
    social: str  # solo, date, group
    vibe: str  # hangover, stressed, lazy, happy

# Food item response
class FoodItemResponse(BaseModel):
    id: int
    name: str
    emoji: str
    cuisine: str
    tags: List[str]
    avg_price: int
    description: Optional[str]
    spice_level: int
    is_vegetarian: bool
    serving_size: str
    temperature: str
    
    class Config:
        from_attributes = True

# Recommendation with score
class RecommendationWithScore(BaseModel):
    food: FoodItemResponse
    score: float
    matched_tags: List[str]

# API Response for recommendations
class RecommendationResponse(BaseModel):
    best_match: FoodItemResponse
    score: float
    matched_tags: List[str]
    alternatives: List[RecommendationWithScore]
    total_matches: int

# Health check response
class HealthResponse(BaseModel):
    status: str
    message: str
    database: str

