from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Enum as SqlAlchemyEnum,
    JSON,
    CheckConstraint,
)

from sqlalchemy.orm import relationship, validates

from enum import Enum
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


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    lastname = Column(String(100))
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(250))
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    projects = relationship("Project", back_populates="member")

    __table_args__ = (
        CheckConstraint("LENGTH(name) >= 4", name="check_name_length"),
        CheckConstraint("LENGTH(lastname) >= 4", name="check_lastname_length"),
    )

    email_regex = re.compile(
        r"^[a-z]+\.[a-z]+\.\d{4}@miremington\.edu\.co$|^[a-z]+\.[a-z]+@uniremington\.edu\.co$"
    )

    @validates("email")
    def validate_email(self, key, email):
        # Validar el formato del correo electrónico utilizando regex
        if not self.email_regex.match(email):
            raise ValueError("Correo invalido debes usar tu correo institucional.")
        return email


class Roles(Base):
    __tablename__ = "roles"

    rol_id = Column(Integer, primary_key=True, index=True)
    name = Column(SqlAlchemyEnum(RolName, create_constraint=True), default=RolName.USER)
    authorities = Column(JSON)


class UserRol(Base):
    __tablename__ = "users_roles"

    user_rol_id = Column(Integer, primary_key=True, index=True)
    rol_id = Column(Integer, ForeignKey("roles.rol_id"))
    user_id = Column(Integer, ForeignKey("users.id"))
