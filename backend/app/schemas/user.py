from pydantic import BaseModel, EmailStr

#This will check whether the user request is registering valid data for the JSON.
class UserRegister(BaseModel):
    email: EmailStr #Pydantic will check if the string is a valid email (eg. @email.com) 
                    #and reject invalid inputs (eg. Jane). FastAPI will automatically return an error.
                    #This is known as Pydantic verification
    password: str

#This is to check whether the user log in details are valid
#NB: keeping user registration and log-in seperate will help when users registrations 
#    needs more information than logging in (eg. confirming passwords)
class UserLogin(BaseModel):
    email: EmailStr
    password: str