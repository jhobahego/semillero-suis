from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List
from enum import Enum


class Autority(str, Enum):
    READ = "READ"
    CREATE = "CREATE"
    MODIFY = "MODIFY"
    DELETE = "DELETE"
    CHANGE_CREDENTIALS = "CHANGE_CREDENTIALS"


class RolName(str, Enum):
    GESTOR = "GESTOR"
    TEACHER = "TEACHER"
    STUDENT = "STUDENT"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    is_active: bool
    is_superuser: bool
    authorities: List[Autority]
    rol: RolName


class UserBase(BaseModel):
    name: str
    email: str
    is_active: bool
    is_superuser: bool


class UserCreate(BaseModel):
    dni: int
    name: str
    lastname: str
    email: EmailStr
    password: str
    semester: int | None = None
    university: str
    sede: str | None = None


class UserInDB(UserBase):
    id: Optional[int] = None


class User(BaseModel):
    id: int
    dni: int
    name: str
    lastname: str
    email: str
    hashed_password: str
    semester: int
    university: str
    sede: str
    is_active: bool
    is_superuser: bool

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    name: Optional[str]
    lastname: Optional[str]
    email: Optional[str]
    password: Optional[str]
    semester: Optional[int]
    university: Optional[str]
    sede: Optional[str]
    is_active: Optional[bool]
    is_superuser: Optional[bool]
