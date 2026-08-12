from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column( String, unique=True, nullable=False, index=True) #"unique=True" is for Database-side validation
    password_hash = Column(String, nullable=False)

    #(Allowing) ONE (user) TO (have) MANY (favourites). 
    favourites = relationship("Favourite", back_populates="user")