from sqlalchemy import Column, Integer, String, Text, JSON
from database import Base

class FoodItem(Base):
    __tablename__ = "food_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    emoji = Column(String(10), nullable=False)
    cuisine = Column(String(50), nullable=False)  # indian, chinese, fastfood, healthy, dessert, beverage
    tags = Column(JSON, nullable=False)  # List of tags for matching
    avg_price = Column(Integer, default=200)  # Average price in INR
    description = Column(Text, nullable=True)
    spice_level = Column(Integer, default=0)  # 0-5
    is_vegetarian = Column(Integer, default=0)  # 0 or 1
    serving_size = Column(String(20), default="regular")  # small, regular, large
    temperature = Column(String(10), default="hot")  # hot, cold, room
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "emoji": self.emoji,
            "cuisine": self.cuisine,
            "tags": self.tags,
            "avg_price": self.avg_price,
            "description": self.description,
            "spice_level": self.spice_level,
            "is_vegetarian": bool(self.is_vegetarian),
            "serving_size": self.serving_size,
            "temperature": self.temperature
        }

