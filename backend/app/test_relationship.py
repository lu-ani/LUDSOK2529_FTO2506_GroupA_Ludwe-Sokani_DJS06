from app.database import SessionLocal
from app.models.user import User
from app.models.favourite import Favourite


db = SessionLocal()

# Create a test user
user = User(
    email="test@example.com",
    password_hash="fake_hash"
)

db.add(user)
db.commit() #Insertis the user into PostgreSQL
db.refresh(user) #Reloads the object from the database

# Create a favourite belonging to that user
favourite = Favourite(
    podcast_id="podcast_123",
    user_id=user.id #Identifies the user to add it to
)

db.add(favourite)
db.commit() 

# Fetch user again
saved_user = db.query(User).filter(
    User.email == "test@example.com"
).first()

print(saved_user.email)
print(saved_user.favourites)

db.close()