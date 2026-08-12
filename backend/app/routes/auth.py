# Seperating authentication route for maintainability.

import app.models  #Trying to force models to load

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin
from app.utils.password import hash_password, verify_password

from app.security.jwt import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

#####  REGISTERING NEW USER #####

@router.post("/register")
def register(
    user: UserRegister, 
    #Get database from get_db BEFORE running the route
    db: Session = Depends(get_db)
):
    
    #Create variable to check whether the user is already in the databse
    existing_user = (db.query(User).filter(User.email == user.email).first())  

    #Return 400 code if user exists

    #NB: This is known as Business logic validation
    if existing_user:
        raise HTTPException(status_code=400,detail="Email already registered") 
    
    hashed_password = hash_password(user.password)

    #Create a SQLAlchemy model instance
    new_user = User(email=user.email, password_hash=hashed_password)

    db.add(new_user) #Stage new user for insertion
    db.commit() #Write new user to PostgreSQL
    db.refresh(new_user) #Just reloads the object (new_user.id)

    return {
        "message": "User registered successfully", 
        "user_id": new_user.id, 
        "email": new_user.email
    }

##### vERIFYING USER LOGIN #####

#Needed to change user param, imported OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordRequestForm

@router.post("/login")
def login(
    #Swagger isn't able to work with the user data type 
    #Now changing the paramater to
    #user: UserLogin,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    #Finding the user in the databse
    db_user = (db.query(User).filter(User.email == form_data.username).first())

    #Old logic:
    #db_user = (db.query(User).filter(User.email == user.email).first())

    #Checking whether the user exists
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    #Verifying password using the hash with the existing salt
    #old logic before adapting to swagger:
    #if not verify_password(user.password, db_user.password_hash):
    if not verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    #Creating the access token
    #JWT has standard claim names, sub (subject) is one of them
    access_token = create_access_token({"sub": str(db_user.id)})

    #Returning the full token
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }

    #Old return statement, before JWT intergration:
    #return {"message": "Login successful", "user_id": db_user.id, "email": db_user.email}

from app.dependencies import get_current_user

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "email": current_user.email,
    }