from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    BigInteger,
    String,
    Enum as SqlAlchemyEnum,
    JSON,
    CheckConstraint,
)

from sqlalchemy.orm import validates, relationship

from enum import Enum
from decouple import config

from db import Base

import re


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


class Roles(Base):
    __tablename__ = "roles"

    rol_id = Column(Integer, primary_key=True, index=True)
    name = Column(SqlAlchemyEnum(RolName, create_constraint=True))
    authorities = Column(JSON)
    users = relationship("User", secondary="users_roles", back_populates="roles")


class UserRol(Base):
    __tablename__ = "users_roles"

    user_rol_id = Column(Integer, primary_key=True, index=True)
    rol_id = Column(Integer, ForeignKey("roles.rol_id"))
    user_id = Column(Integer, ForeignKey("users.id"))


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    dni = Column(BigInteger, unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    lastname = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(250), nullable=False)
    phone_number = Column(String(20), unique=True, nullable=False)
    university = Column(String(255), nullable=False)
    university_site = Column(String(150), nullable=True)
    semester = Column(Integer, nullable=True)
    program = Column(String(100), nullable=True)
    faculty = Column(String(100), nullable=True)
    research_team = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    roles = relationship("Roles", secondary="users_roles", back_populates="users")

    __table_args__ = (
        CheckConstraint("LENGTH(name) >= 4", name="check_name_length"),
        CheckConstraint("LENGTH(lastname) >= 4", name="check_lastname_length"),
    )

    email_regex = re.compile(
        r"^[a-z]+\.[a-z]+\.\d{4}@miremington\.edu\.co$|^[a-z]+\.[a-z]+@uniremington\.edu\.co$"
    )

    @validates("email")
    def validate_email(self, key, email):
        admin_email = config("ADMIN_EMAIL")
        if not self.email_regex.match(email) and not email == admin_email:
            raise ValueError("Correo invalido debes usar tu correo institucional.")
        return email
