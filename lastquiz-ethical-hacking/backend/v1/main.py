from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from fastapi.security import OAuth2PasswordRequestForm

from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
)
from fastapi.staticfiles import StaticFiles

from datetime import timedelta, datetime, date
from app.models.login import Token, Profile, User, profile_example, EditProfile
from app.utils.authentication import (
    get_current_active_user, 
    authenticate_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token
    )

import os
import random

import pymongo
mongo_client = pymongo.MongoClient("mongodb://mongo:27017/")
profiles_db = mongo_client["profiles"]
accounts_list = profiles_db["accounts"]

app = FastAPI(
        title="API: Auth",
        description="Documentation",
        version="0.1.0",
        docs_url=None,
        redoc_url=None,
        root_path="/api/v1",
        )


app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(os.getenv('CORS_ORIGIN'))],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static", StaticFiles(directory="/app/app/static"), name="static")

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/api/v1/openapi.json",
        title=app.title,
        swagger_favicon_url="static/logo.png",
    )

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url="/api/v1/openapi.json",
        title=app.title + " - ReDoc",
        redoc_favicon_url="static/logo.png",
    )

@app.get("/", include_in_schema=False)
async def root():
    response = RedirectResponse(url='/api/v1/docs')
    return response

################
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "userid": user.username,
            "name": user.name,
            }, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "name": user.name,
        }

################

@app.get("/number")
async def get_random_number(current_user: User = Depends(get_current_active_user)):
    return {
        "data": random.randint(0, 99)
    }

@app.get("/flag")
async def get_flag(current_user: User = Depends(get_current_active_user)):
    return {
        "flag": '''
            Congrats for finding this flag!
            Hopefully you enjoy this course.
            See you again in the future!
        '''
    }
