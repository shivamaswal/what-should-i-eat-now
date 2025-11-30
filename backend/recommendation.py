from typing import List, Tuple
from sqlalchemy.orm import Session
from models import FoodItem
from schemas import QuizAnswers

def quiz_to_tags(answers: QuizAnswers) -> List[str]:
    """Convert quiz answers to searchable tags"""
    tags = []
    
    # Hunger level (0-100)
    if answers.hunger < 33:
        tags.append("hunger_low")
        tags.append("light")
        tags.append("snack")
    elif answers.hunger < 66:
        tags.append("hunger_medium")
        tags.append("regular")
    else:
        tags.append("hunger_high")
        tags.append("filling")
        tags.append("heavy")
    
    # Budget
    if answers.budget == "broke":
        tags.append("budget_low")
        tags.append("cheap")
        tags.append("affordable")
    elif answers.budget == "moderate":
        tags.append("budget_medium")
        tags.append("moderate_price")
    else:  # balling
        tags.append("budget_high")
        tags.append("premium")
        tags.append("expensive")
    
    # Healthiness (0-100, lower = healthier)
    if answers.healthiness < 40:
        tags.append("healthy")
        tags.append("nutritious")
        tags.append("light")
    elif answers.healthiness > 60:
        tags.append("indulgent")
        tags.append("comfort")
        tags.append("rich")
    else:
        tags.append("balanced")
    
    # Temperature preference (0-100, lower = cold)
    if answers.temperature < 40:
        tags.append("cold")
        tags.append("chilled")
        tags.append("refreshing")
    elif answers.temperature > 60:
        tags.append("hot")
        tags.append("warm")
        tags.append("steaming")
    else:
        tags.append("room_temp")
    
    # Spice level (0-5)
    if answers.spice == 0:
        tags.append("spice_none")
        tags.append("mild")
        tags.append("no_spice")
    elif answers.spice <= 2:
        tags.append("spice_mild")
        tags.append("slightly_spicy")
    elif answers.spice <= 4:
        tags.append("spice_medium")
        tags.append("spicy")
    else:  # 5
        tags.append("spice_hot")
        tags.append("very_spicy")
        tags.append("fiery")
    
    # Social setting
    if answers.social == "solo":
        tags.append("solo")
        tags.append("single_serving")
        tags.append("quick")
    elif answers.social == "date":
        tags.append("date")
        tags.append("romantic")
        tags.append("shareable")
    else:  # group
        tags.append("group")
        tags.append("shareable")
        tags.append("party")
        tags.append("family")
    
    # Vibe/Mood
    if answers.vibe == "hangover":
        tags.append("hangover")
        tags.append("comfort")
        tags.append("greasy")
        tags.append("carbs")
        tags.append("recovery")
    elif answers.vibe == "stressed":
        tags.append("stressed")
        tags.append("comfort")
        tags.append("quick")
        tags.append("easy")
    elif answers.vibe == "lazy":
        tags.append("lazy")
        tags.append("easy")
        tags.append("delivery")
        tags.append("no_effort")
    else:  # happy
        tags.append("happy")
        tags.append("celebratory")
        tags.append("treat")
        tags.append("special")
    
    return tags

def calculate_match_score(food_tags: List[str], user_tags: List[str]) -> Tuple[float, List[str]]:
    """Calculate how well a food item matches user preferences"""
    food_tags_set = set(tag.lower() for tag in food_tags)
    user_tags_set = set(tag.lower() for tag in user_tags)
    
    # Find matching tags
    matched_tags = list(food_tags_set.intersection(user_tags_set))
    
    # Calculate score (percentage of user tags matched + bonus for food-specific matches)
    if len(user_tags_set) == 0:
        return 0.0, []
    
    # Base score from matched tags
    base_score = len(matched_tags) / len(user_tags_set) * 100
    
    # Bonus for having more specific matches
    bonus = len(matched_tags) * 2
    
    final_score = min(base_score + bonus, 100)
    
    return round(final_score, 1), matched_tags

def get_recommendations(db: Session, answers: QuizAnswers, limit: int = 3) -> List[Tuple[FoodItem, float, List[str]]]:
    """Get top food recommendations based on quiz answers"""
    
    # Convert quiz answers to tags
    user_tags = quiz_to_tags(answers)
    
    # Get all food items
    all_foods = db.query(FoodItem).all()
    
    # Calculate scores for each food item
    scored_foods = []
    for food in all_foods:
        score, matched_tags = calculate_match_score(food.tags, user_tags)
        if score > 0:  # Only include items with some match
            scored_foods.append((food, score, matched_tags))
    
    # Sort by score (highest first)
    scored_foods.sort(key=lambda x: x[1], reverse=True)
    
    # Return top N recommendations
    return scored_foods[:limit]

def get_random_fallback(db: Session) -> FoodItem:
    """Get a random food item as fallback"""
    import random
    all_foods = db.query(FoodItem).all()
    if all_foods:
        return random.choice(all_foods)
    return None

