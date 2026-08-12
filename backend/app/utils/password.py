from passlib.context import CryptContext

# Google definition of Salting: Salting is a security technique used to enhance the protection of hashed data, 
#                               particularly passwords. It involves adding a unique, random string of characters, 
#                               known as a "salt," to the input data before hashing. 
#                               This ensures that even if two users have the same password, their resulting hashes will be different, 
#                               making it significantly harder for attackers to exploit the data.


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") #utilise bcrypt when passwords are hased


def hash_password(password: str) -> str:
    return pwd_context.hash(password) #Function takes passwords and returns hashed password


def verify_password(plain_password: str, hashed_password: str) -> bool: #"hashed_password" is important
                                                                        # as it will use the salt stored in the hash 
                                                                        # to run the same calculation as before.
    return pwd_context.verify(plain_password, hashed_password) #Return boolean value whether password matches hashed password

#NB 1: This is a one-way transformation, we can't reverse it to find the passwords, so they're more secure
#NB 2: salts prevent the same password from producing the same hash.
