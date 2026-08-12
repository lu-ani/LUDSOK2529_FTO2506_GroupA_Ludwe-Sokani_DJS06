from app.database import Base, engine

from app.models.user import User
from app.models.favourite import Favourite

Base.metadata.create_all(bind=engine)

print("Tables created successfully")