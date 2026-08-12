from datetime import datetime, timedelta
from jose import jwt
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

#Used to generate SECRET_KEY value one-time (commented out now):
# import secrets
#print(secrets.token_hex(32))

#Creates a signed JWT.
def create_access_token(data: dict):
    
    #Copy data, kept seperate to avoid modifying the original library
    to_encode = data.copy()

    #Create a future timestap when data will expire
    expire = (datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    #Adding the expiration
    to_encode.update({"exp": expire})

    #Signing the token, creating the JWT token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


from jose import JWTError

#Decoding and verifying the JWT

def verify_access_token(token: str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:
        return None