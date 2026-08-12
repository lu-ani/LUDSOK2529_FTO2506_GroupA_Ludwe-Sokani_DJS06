# Reusable dependency for connecting to the databse. 
# To avoid every route created needing to open and close the connection each time.

from app.database import SessionLocal



from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.security.jwt import verify_access_token
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

#Working on extracting the JWT from the authorization header

OAuth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


#This function should run when it has the JWT from the request header and databse session already
def get_current_user(
        token: str = Depends(OAuth2_scheme),
        db: Session = Depends(get_db)
    ):
        payload = verify_access_token(token)

        #stopping the processes should the user not have all their information.
        if payload is None:
              raise HTTPException(
                    status_code = 401,
                    detail = "Invalid token")

        #user_id = payload("sub") returned error when testing null sub. .get is safer.
        user_id = payload.get("sub")

        if user_id is None:
                raise HTTPException(
                    status_code = 401,
                    detail = "Invalid token")

        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
                raise HTTPException(
                    status_code = 401,
                    detail = "User not found")
            
        return user


