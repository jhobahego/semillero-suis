from pydantic import BaseModel, ConfigDict
from typing import Optional


class UserBase(BaseModel):
    email: str


class UserCreate(BaseModel):
    name: str
    lastname: str
    email: str
    password: str


class User(BaseModel):
    user_id: int
    name: str
    lastname: str
    email: str
    hashed_password: str
    is_active: bool
    is_superuser: bool

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    name: Optional[str]
    lastname: Optional[str]
    email: Optional[str]
    password: Optional[str]
    is_active: Optional[bool]
    is_superuser: Optional[bool]
