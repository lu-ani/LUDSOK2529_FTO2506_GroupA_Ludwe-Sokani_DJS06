from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Favourite(Base):
    __tablename__ = "favourites"

    id = Column(Integer, primary_key=True, index=True)
    podcast_id = Column(String, nullable=False)
    user_id = Column(Integer, 
                     ForeignKey("users.id"), # DATABASE LEVEL RELATIONSHIP
                     nullable=False)
    
    #(Allowing) ONE (user) TO (have) MANY (favourites). 
    user = relationship("User", back_populates="favourites") #PYTHON LEVEL RELATIONSHIP