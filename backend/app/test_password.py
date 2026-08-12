#Error with compatibility when bcrypt was v5.0.0, switched to 4.1.3
#There is still a minor error since Passlib expects a newer version of bcrypt, but it still works

from app.utils.password import (hash_password, verify_password) #Importing functions from app\utils\password.py

password = "mypassword123"

hashed = hash_password(password)

print(f"Password: {password}")
#print(password)

print(f"\nHash: {hashed}")
#print(hashed)

print(f"\nCorrect Password: {verify_password("mypassword123", hashed)}")
#print(verify_password("mypassword123", hashed))

print(f"\nWrong Password: {verify_password("wrongpassword", hashed)}")
#print(verify_password("wrongpassword", hashed))

#When run multiple times, the hash is different each time.
#