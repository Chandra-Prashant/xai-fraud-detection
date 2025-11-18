from beanie import init_beanie, Document
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone # <-- The Python 3.10 fix is here

# 1. Pydantic model for environment variables
class Settings(BaseSettings):
    MONGO_URI: str
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

# 2. Define the "shape" of our model comparison
class ModelResult(BaseModel):
    name: str
    prediction: int
    probability: float

# 3. Define our database Document model
class Transaction(Document):
    raw_features: dict 
    final_status: str
    model_results: List[ModelResult] 
    created_at: datetime = datetime.now(timezone.utc) # <-- The Python 3.10 fix is here

    class Settings:
        name = "transactions" # The MongoDB collection name
        use_pydantic_v2 = True
        
# 4. Database initialization function
async def init_database():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.MONGO_URI)
    await init_beanie(database=client.get_default_database(), document_models=[Transaction])
    print("Successfully connected to MongoDB.")