import os

from dotenv import load_dotenv

#Loads Enviroment variables (.env) and makes it's values available
load_dotenv()

#Gets the secret key
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

#Enviroment variables are always taken as a string so they need
#to be converted to integers where relevent
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
)