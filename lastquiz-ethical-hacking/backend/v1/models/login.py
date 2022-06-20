from typing import Optional
from pydantic import BaseModel
from enum import Enum

class User(BaseModel):
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str
    name: str 

class TokenData(BaseModel):
    username: Optional[str] = None


class UserInDB(BaseModel):
    username: str
    hashed_password: str

profile_example = {
    "regular": {
        "summary": "User",
        "value": {
                "userid": "userdummy",
                "password": "yoursecurepassword",
                "name": "User Dummy",
        }
    },
}

class Profile(BaseModel):
    userid: str
    password: str
    name: str 
    
    class Config:
        schema_extra = {
            "example": {
                "userid": "userdummy",
                "password": "yoursecurepassword",
                "name": "User Dummy",
            }
        }

class EditProfile(BaseModel):
    userid: str
    password: Optional[str] = None
    name: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "userid": "userdummy",
                "password": "yoursecurepassword",
                "name": "User Dummy",
            }
        }