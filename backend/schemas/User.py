from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional


class UserBase(BaseModel):
    name: str
    email: str
    is_active: bool
    is_superuser: bool


class UserCreate(BaseModel):
    name: str
    lastname: str
    email: EmailStr
    password: str


class UserInDB(UserBase):
    id: Optional[int] = None


class User(BaseModel):
    id: int
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
