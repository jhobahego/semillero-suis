from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Enum as SqlAlchemyEnum,
)

from sqlalchemy.orm import relationship

from enum import Enum
from db import Base


class RolName(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    lastname = Column(String(100))
    email = Column(String(150), unique=True, index=True)
    hashed_password = Column(String(250))
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    projects = relationship("Project", back_populates="member")


class Roles(Base):
    __tablename__ = "roles"

    rol_id = Column(Integer, primary_key=True, index=True)
    name = Column(SqlAlchemyEnum(RolName, create_constraint=True), default=RolName.USER)


class UserRol(Base):
    __tablename__ = "users_roles"

    user_rol_id = Column(Integer, primary_key=True, index=True)
    rol_id = Column(Integer, ForeignKey("roles.rol_id"))
    user_id = Column(Integer, ForeignKey("users.id"))
