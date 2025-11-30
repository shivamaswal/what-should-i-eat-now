from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import Base, FoodItem

# Food items data
FOOD_ITEMS = [
    # ========== INDIAN ==========
    {
        "name": "Chicken Biryani",
        "emoji": "🍛",
        "cuisine": "indian",
        "tags": ["indian", "spicy", "hot", "filling", "heavy", "rice", "comfort", "spice_medium", "budget_medium", "hunger_high", "celebratory", "special", "party", "group", "shareable"],
        "avg_price": 250,
        "description": "Aromatic basmati rice layered with spiced chicken",
        "spice_level": 3,
        "is_vegetarian": 0,
        "serving_size": "large",
        "temperature": "hot"
    },
    {
        "name": "Butter Chicken",
        "emoji": "🍗",
        "cuisine": "indian",
        "tags": ["indian", "creamy", "hot", "comfort", "rich", "indulgent", "spice_mild", "budget_medium", "hunger_medium", "date", "romantic"],
        "avg_price": 280,
        "description": "Tender chicken in rich tomato-butter gravy",
        "spice_level": 2,
        "is_vegetarian": 0,
        "serving_size": "regular",
        "temperature": "hot"
    },
    {
        "name": "Paneer Tikka",
        "emoji": "🧀",
        "cuisine": "indian",
        "tags": ["indian", "vegetarian", "spicy", "hot", "protein", "spice_medium", "budget_medium", "hunger_medium", "healthy", "grilled"],
        "avg_price": 220,
        "description": "Grilled cottage cheese with Indian spices",
        "spice_level": 3,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "hot"
    },
    {
        "name": "Chole Bhature",
        "emoji": "🫓",
        "cuisine": "indian",
        "tags": ["indian", "vegetarian", "filling", "heavy", "comfort", "carbs", "spice_medium", "budget_low", "hunger_high", "hangover", "greasy", "cheap", "affordable"],
        "avg_price": 120,
        "description": "Spiced chickpeas with fluffy fried bread",
        "spice_level": 2,
        "is_vegetarian": 1,
        "serving_size": "large",
        "temperature": "hot"
    },
    {
        "name": "Masala Dosa",
        "emoji": "🥙",
        "cuisine": "indian",
        "tags": ["indian", "vegetarian", "crispy", "light", "spice_mild", "budget_low", "hunger_medium", "quick", "cheap", "affordable", "solo", "single_serving"],
        "avg_price": 100,
        "description": "Crispy crepe filled with spiced potatoes",
        "spice_level": 2,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "hot"
    },
    {
        "name": "Samosa",
        "emoji": "🥟",
        "cuisine": "indian",
        "tags": ["indian", "vegetarian", "snack", "light", "crispy", "spice_mild", "budget_low", "hunger_low", "quick", "cheap", "tea_time", "affordable"],
        "avg_price": 30,
        "description": "Crispy pastry filled with spiced potatoes",
        "spice_level": 2,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "hot"
    },
    {
        "name": "Dal Makhani",
        "emoji": "🍲",
        "cuisine": "indian",
        "tags": ["indian", "vegetarian", "creamy", "comfort", "rich", "protein", "spice_mild", "budget_medium", "hunger_medium", "healthy", "nutritious"],
        "avg_price": 180,
        "description": "Creamy black lentils slow-cooked overnight",
        "spice_level": 1,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "hot"
    },
    {
        "name": "Tandoori Chicken",
        "emoji": "🍖",
        "cuisine": "indian",
        "tags": ["indian", "grilled", "spicy", "hot", "protein", "spice_medium", "budget_medium", "hunger_high", "healthy", "low_carb"],
        "avg_price": 300,
        "description": "Yogurt-marinated chicken roasted in tandoor",
        "spice_level": 3,
        "is_vegetarian": 0,
        "serving_size": "large",
        "temperature": "hot"
    },
    
    # ========== CHINESE ==========
    {
        "name": "Fried Rice",
        "emoji": "🍚",
        "cuisine": "chinese",
        "tags": ["chinese", "rice", "quick", "filling", "spice_mild", "budget_low", "hunger_medium", "easy", "delivery", "solo", "comfort", "cheap"],
        "avg_price": 150,
        "description": "Wok-tossed rice with vegetables and egg",
        "spice_level": 1,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "hot"
    },
    {
        "name": "Manchurian",
        "emoji": "🥡",
        "cuisine": "chinese",
        "tags": ["chinese", "indo_chinese", "spicy", "hot", "crispy", "spice_medium", "budget_low", "hunger_medium", "party", "shareable", "cheap"],
        "avg_price": 180,
        "description": "Crispy vegetable balls in tangy sauce",
        "spice_level": 3,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "hot"
    },
    {
        "name": "Hakka Noodles",
        "emoji": "🍜",
        "cuisine": "chinese",
        "tags": ["chinese", "noodles", "quick", "filling", "spice_mild", "budget_low", "hunger_medium", "easy", "delivery", "solo", "comfort", "cheap"],
        "avg_price": 140,
        "description": "Stir-fried noodles with vegetables",
        "spice_level": 2,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "hot"
    },
    {
        "name": "Spring Rolls",
        "emoji": "🥢",
        "cuisine": "chinese",
        "tags": ["chinese", "snack", "crispy", "light", "spice_none", "budget_low", "hunger_low", "party", "shareable", "appetizer", "cheap"],
        "avg_price": 120,
        "description": "Crispy rolls stuffed with vegetables",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "hot"
    },
    {
        "name": "Momos",
        "emoji": "🥟",
        "cuisine": "chinese",
        "tags": ["chinese", "dumplings", "steamed", "light", "spice_mild", "budget_low", "hunger_medium", "snack", "quick", "solo", "cheap", "affordable"],
        "avg_price": 80,
        "description": "Steamed dumplings with spicy chutney",
        "spice_level": 2,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "hot"
    },
    {
        "name": "Chilli Chicken",
        "emoji": "🌶️",
        "cuisine": "chinese",
        "tags": ["chinese", "indo_chinese", "spicy", "hot", "crispy", "spice_hot", "budget_medium", "hunger_medium", "party", "fiery", "very_spicy"],
        "avg_price": 220,
        "description": "Crispy chicken tossed in spicy sauce",
        "spice_level": 4,
        "is_vegetarian": 0,
        "serving_size": "regular",
        "temperature": "hot"
    },
    {
        "name": "Sweet Corn Soup",
        "emoji": "🥣",
        "cuisine": "chinese",
        "tags": ["chinese", "soup", "light", "healthy", "warm", "spice_none", "budget_low", "hunger_low", "solo", "nutritious", "cheap", "mild"],
        "avg_price": 100,
        "description": "Creamy corn soup with vegetables",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "hot"
    },
    {
        "name": "Schezwan Noodles",
        "emoji": "🍝",
        "cuisine": "chinese",
        "tags": ["chinese", "noodles", "spicy", "hot", "fiery", "spice_hot", "budget_low", "hunger_medium", "very_spicy", "cheap"],
        "avg_price": 160,
        "description": "Spicy noodles with Schezwan sauce",
        "spice_level": 5,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "hot"
    },
    
    # ========== FAST FOOD ==========
    {
        "name": "Classic Burger",
        "emoji": "🍔",
        "cuisine": "fastfood",
        "tags": ["fastfood", "burger", "filling", "comfort", "indulgent", "greasy", "spice_none", "budget_medium", "hunger_high", "hangover", "lazy", "delivery", "easy", "carbs", "mild"],
        "avg_price": 180,
        "description": "Juicy beef patty with fresh veggies",
        "spice_level": 0,
        "is_vegetarian": 0,
        "serving_size": "large",
        "temperature": "hot"
    },
    {
        "name": "Pepperoni Pizza",
        "emoji": "🍕",
        "cuisine": "fastfood",
        "tags": ["fastfood", "pizza", "cheesy", "comfort", "indulgent", "shareable", "party", "spice_mild", "budget_medium", "hunger_high", "lazy", "delivery", "group", "family", "carbs"],
        "avg_price": 350,
        "description": "Classic pizza topped with pepperoni",
        "spice_level": 1,
        "is_vegetarian": 0,
        "serving_size": "large",
        "temperature": "hot"
    },
    {
        "name": "French Fries",
        "emoji": "🍟",
        "cuisine": "fastfood",
        "tags": ["fastfood", "snack", "crispy", "salty", "light", "spice_none", "budget_low", "hunger_low", "quick", "easy", "solo", "cheap", "greasy", "carbs", "mild"],
        "avg_price": 100,
        "description": "Crispy golden potato fries",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "hot"
    },
    {
        "name": "Chicken Sandwich",
        "emoji": "🥪",
        "cuisine": "fastfood",
        "tags": ["fastfood", "sandwich", "quick", "filling", "spice_mild", "budget_low", "hunger_medium", "solo", "single_serving", "easy", "cheap", "affordable"],
        "avg_price": 150,
        "description": "Grilled chicken with fresh vegetables",
        "spice_level": 1,
        "is_vegetarian": 0,
        "serving_size": "regular",
        "temperature": "hot"
    },
    {
        "name": "Hot Dog",
        "emoji": "🌭",
        "cuisine": "fastfood",
        "tags": ["fastfood", "quick", "snack", "light", "spice_none", "budget_low", "hunger_low", "solo", "cheap", "easy", "mild", "affordable"],
        "avg_price": 80,
        "description": "Classic hot dog with mustard",
        "spice_level": 0,
        "is_vegetarian": 0,
        "serving_size": "small",
        "temperature": "hot"
    },
    {
        "name": "Chicken Wrap",
        "emoji": "🌯",
        "cuisine": "fastfood",
        "tags": ["fastfood", "wrap", "quick", "filling", "portable", "spice_mild", "budget_low", "hunger_medium", "solo", "easy", "cheap", "affordable"],
        "avg_price": 140,
        "description": "Grilled chicken wrapped in tortilla",
        "spice_level": 1,
        "is_vegetarian": 0,
        "serving_size": "regular",
        "temperature": "hot"
    },
    {
        "name": "Loaded Nachos",
        "emoji": "🧀",
        "cuisine": "fastfood",
        "tags": ["fastfood", "nachos", "cheesy", "shareable", "party", "snack", "spice_mild", "budget_medium", "hunger_medium", "group", "indulgent", "happy", "celebratory"],
        "avg_price": 200,
        "description": "Crispy nachos with cheese and toppings",
        "spice_level": 2,
        "is_vegetarian": 1,
        "serving_size": "large",
        "temperature": "hot"
    },
    {
        "name": "Tacos",
        "emoji": "🌮",
        "cuisine": "fastfood",
        "tags": ["fastfood", "mexican", "spicy", "quick", "shareable", "spice_medium", "budget_low", "hunger_medium", "party", "date", "fun", "cheap"],
        "avg_price": 180,
        "description": "Crunchy tacos with seasoned filling",
        "spice_level": 3,
        "is_vegetarian": 0,
        "serving_size": "regular",
        "temperature": "hot"
    },
    {
        "name": "Veggie Burger",
        "emoji": "🍔",
        "cuisine": "fastfood",
        "tags": ["fastfood", "burger", "vegetarian", "filling", "spice_none", "budget_medium", "hunger_high", "healthy", "balanced", "mild"],
        "avg_price": 160,
        "description": "Plant-based patty with fresh veggies",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "large",
        "temperature": "hot"
    },
    
    # ========== HEALTHY/SALADS ==========
    {
        "name": "Caesar Salad",
        "emoji": "🥗",
        "cuisine": "healthy",
        "tags": ["healthy", "salad", "light", "nutritious", "fresh", "spice_none", "budget_medium", "hunger_low", "solo", "diet", "low_carb", "mild"],
        "avg_price": 220,
        "description": "Crisp romaine with parmesan and croutons",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "cold"
    },
    {
        "name": "Smoothie Bowl",
        "emoji": "🥣",
        "cuisine": "healthy",
        "tags": ["healthy", "smoothie", "fresh", "cold", "light", "nutritious", "spice_none", "budget_medium", "hunger_low", "refreshing", "chilled", "mild", "solo"],
        "avg_price": 250,
        "description": "Blended fruits topped with granola",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "cold"
    },
    {
        "name": "Grilled Chicken Salad",
        "emoji": "🥗",
        "cuisine": "healthy",
        "tags": ["healthy", "salad", "protein", "light", "nutritious", "spice_none", "budget_medium", "hunger_medium", "diet", "low_carb", "solo", "mild"],
        "avg_price": 280,
        "description": "Grilled chicken on fresh greens",
        "spice_level": 0,
        "is_vegetarian": 0,
        "serving_size": "regular",
        "temperature": "cold"
    },
    {
        "name": "Quinoa Bowl",
        "emoji": "🍲",
        "cuisine": "healthy",
        "tags": ["healthy", "quinoa", "protein", "filling", "nutritious", "spice_none", "budget_high", "hunger_medium", "premium", "superfood", "vegetarian", "mild"],
        "avg_price": 320,
        "description": "Quinoa with roasted vegetables",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "room"
    },
    {
        "name": "Vegetable Soup",
        "emoji": "🥣",
        "cuisine": "healthy",
        "tags": ["healthy", "soup", "warm", "light", "nutritious", "hot", "spice_none", "budget_low", "hunger_low", "comfort", "recovery", "mild", "cheap"],
        "avg_price": 120,
        "description": "Hearty soup with fresh vegetables",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "hot"
    },
    {
        "name": "Protein Shake",
        "emoji": "🥤",
        "cuisine": "healthy",
        "tags": ["healthy", "protein", "cold", "quick", "light", "spice_none", "budget_medium", "hunger_low", "post_workout", "refreshing", "chilled", "mild", "solo"],
        "avg_price": 180,
        "description": "Whey protein with milk and banana",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "cold"
    },
    {
        "name": "Avocado Toast",
        "emoji": "🥑",
        "cuisine": "healthy",
        "tags": ["healthy", "toast", "light", "trendy", "spice_none", "budget_medium", "hunger_low", "breakfast", "brunch", "solo", "mild", "nutritious"],
        "avg_price": 200,
        "description": "Smashed avocado on sourdough",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "room"
    },
    {
        "name": "Greek Yogurt Parfait",
        "emoji": "🥛",
        "cuisine": "healthy",
        "tags": ["healthy", "yogurt", "cold", "light", "sweet", "spice_none", "budget_medium", "hunger_low", "breakfast", "refreshing", "chilled", "mild", "solo"],
        "avg_price": 180,
        "description": "Layers of yogurt, granola, and berries",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "cold"
    },
    
    # ========== DESSERTS ==========
    {
        "name": "Chocolate Ice Cream",
        "emoji": "🍨",
        "cuisine": "dessert",
        "tags": ["dessert", "icecream", "cold", "sweet", "indulgent", "chilled", "refreshing", "spice_none", "budget_low", "hunger_low", "treat", "happy", "celebratory", "mild", "cheap"],
        "avg_price": 100,
        "description": "Rich chocolate ice cream scoop",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "cold"
    },
    {
        "name": "Brownie",
        "emoji": "🍫",
        "cuisine": "dessert",
        "tags": ["dessert", "chocolate", "sweet", "indulgent", "rich", "comfort", "spice_none", "budget_low", "hunger_low", "treat", "happy", "cheap", "mild"],
        "avg_price": 80,
        "description": "Fudgy chocolate brownie",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "room"
    },
    {
        "name": "Gulab Jamun",
        "emoji": "🍩",
        "cuisine": "dessert",
        "tags": ["dessert", "indian", "sweet", "traditional", "indulgent", "hot", "warm", "spice_none", "budget_low", "hunger_low", "celebratory", "special", "cheap", "mild"],
        "avg_price": 60,
        "description": "Deep-fried milk dumplings in syrup",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "hot"
    },
    {
        "name": "Rasgulla",
        "emoji": "⚪",
        "cuisine": "dessert",
        "tags": ["dessert", "indian", "sweet", "light", "traditional", "spice_none", "budget_low", "hunger_low", "mild", "cheap"],
        "avg_price": 50,
        "description": "Soft cheese balls in sugar syrup",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "cold"
    },
    {
        "name": "Cheesecake",
        "emoji": "🍰",
        "cuisine": "dessert",
        "tags": ["dessert", "cake", "creamy", "sweet", "indulgent", "rich", "premium", "spice_none", "budget_high", "hunger_low", "special", "date", "romantic", "treat", "expensive", "mild"],
        "avg_price": 280,
        "description": "Creamy New York style cheesecake",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "cold"
    },
    {
        "name": "Chocolate Pastry",
        "emoji": "🧁",
        "cuisine": "dessert",
        "tags": ["dessert", "pastry", "chocolate", "sweet", "light", "spice_none", "budget_low", "hunger_low", "tea_time", "treat", "cheap", "mild"],
        "avg_price": 70,
        "description": "Fluffy pastry with chocolate cream",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "room"
    },
    {
        "name": "Kulfi",
        "emoji": "🍦",
        "cuisine": "dessert",
        "tags": ["dessert", "indian", "icecream", "cold", "sweet", "traditional", "chilled", "refreshing", "spice_none", "budget_low", "hunger_low", "mild", "cheap"],
        "avg_price": 50,
        "description": "Traditional Indian ice cream",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "cold"
    },
    {
        "name": "Jalebi",
        "emoji": "🥨",
        "cuisine": "dessert",
        "tags": ["dessert", "indian", "sweet", "crispy", "traditional", "hot", "warm", "spice_none", "budget_low", "hunger_low", "celebratory", "cheap", "mild"],
        "avg_price": 40,
        "description": "Crispy spiral sweets in syrup",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "hot"
    },
    
    # ========== BEVERAGES ==========
    {
        "name": "Cold Coffee",
        "emoji": "☕",
        "cuisine": "beverage",
        "tags": ["beverage", "coffee", "cold", "refreshing", "chilled", "caffeine", "spice_none", "budget_low", "hunger_low", "solo", "quick", "cheap", "mild"],
        "avg_price": 120,
        "description": "Chilled coffee with ice cream",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "cold"
    },
    {
        "name": "Mango Lassi",
        "emoji": "🥭",
        "cuisine": "beverage",
        "tags": ["beverage", "lassi", "cold", "sweet", "refreshing", "chilled", "indian", "spice_none", "budget_low", "hunger_low", "solo", "mild", "cheap"],
        "avg_price": 80,
        "description": "Sweet mango yogurt drink",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "cold"
    },
    {
        "name": "Masala Chai",
        "emoji": "🍵",
        "cuisine": "beverage",
        "tags": ["beverage", "chai", "tea", "hot", "warm", "indian", "comfort", "spice_mild", "budget_low", "hunger_low", "solo", "quick", "cheap", "slightly_spicy"],
        "avg_price": 30,
        "description": "Spiced Indian milk tea",
        "spice_level": 1,
        "is_vegetarian": 1,
        "serving_size": "small",
        "temperature": "hot"
    },
    {
        "name": "Fresh Orange Juice",
        "emoji": "🍊",
        "cuisine": "beverage",
        "tags": ["beverage", "juice", "cold", "fresh", "healthy", "refreshing", "chilled", "nutritious", "spice_none", "budget_medium", "hunger_low", "solo", "mild", "recovery"],
        "avg_price": 100,
        "description": "Freshly squeezed orange juice",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "cold"
    },
    {
        "name": "Chocolate Milkshake",
        "emoji": "🥤",
        "cuisine": "beverage",
        "tags": ["beverage", "milkshake", "cold", "sweet", "indulgent", "chilled", "refreshing", "treat", "spice_none", "budget_medium", "hunger_low", "happy", "mild"],
        "avg_price": 150,
        "description": "Thick chocolate shake with ice cream",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "cold"
    },
    {
        "name": "Lemonade",
        "emoji": "🍋",
        "cuisine": "beverage",
        "tags": ["beverage", "lemonade", "cold", "refreshing", "light", "chilled", "summer", "spice_none", "budget_low", "hunger_low", "solo", "cheap", "mild", "recovery"],
        "avg_price": 60,
        "description": "Fresh lemon with mint and ice",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "cold"
    },
    {
        "name": "Buttermilk (Chaas)",
        "emoji": "🥛",
        "cuisine": "beverage",
        "tags": ["beverage", "buttermilk", "cold", "healthy", "refreshing", "chilled", "indian", "digestive", "spice_mild", "budget_low", "hunger_low", "solo", "cheap", "recovery", "hangover"],
        "avg_price": 40,
        "description": "Spiced yogurt drink",
        "spice_level": 1,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "cold"
    },
    {
        "name": "Hot Chocolate",
        "emoji": "🍫",
        "cuisine": "beverage",
        "tags": ["beverage", "chocolate", "hot", "warm", "sweet", "comfort", "indulgent", "cozy", "spice_none", "budget_medium", "hunger_low", "solo", "mild", "treat"],
        "avg_price": 140,
        "description": "Rich hot chocolate with marshmallows",
        "spice_level": 0,
        "is_vegetarian": 1,
        "serving_size": "regular",
        "temperature": "hot"
    },
]


def seed_database():
    """Seed the database with food items"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Get database session
    db = SessionLocal()
    
    try:
        # Check if already seeded
        existing_count = db.query(FoodItem).count()
        if existing_count > 0:
            print(f"Database already has {existing_count} items. Skipping seed.")
            return
        
        # Add food items
        for item_data in FOOD_ITEMS:
            food_item = FoodItem(**item_data)
            db.add(food_item)
        
        db.commit()
        print(f"Successfully seeded {len(FOOD_ITEMS)} food items!")
        
        # Print summary
        cuisines = {}
        for item in FOOD_ITEMS:
            cuisine = item["cuisine"]
            cuisines[cuisine] = cuisines.get(cuisine, 0) + 1
        
        print("\nItems per cuisine:")
        for cuisine, count in cuisines.items():
            print(f"  {cuisine}: {count}")
            
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

