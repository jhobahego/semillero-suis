from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from sqlalchemy.orm import Session

from schemas.Token import Token
from schemas.User import User, UserResponse
from crud.crud_user import user as crud_user
from config.security import create_access_token

from config.deps import get_db, get_current_active_user

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 8

router = APIRouter()


@router.post("/token", tags=["Security"], response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud_user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not crud_user.is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.get("/users/me", tags=["Security"], response_model=UserResponse)
def get_logged_user(user_logged: User = Depends(get_current_active_user)):
    return user_logged
