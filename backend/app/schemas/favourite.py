from pydantic import BaseModel

class FavouriteCreate(BaseModel):
    podcast_id: str
