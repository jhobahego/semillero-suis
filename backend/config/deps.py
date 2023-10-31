from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Generator
from pydantic import ValidationError
from sqlalchemy.orm import Session
from jose import jwt

from decouple import config

from crud import crud_user as crud
from models.User import User, UserRol, Roles, RolName
from schemas.Token import TokenPayload
from . import security

from db import SessionLocal


reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="token")


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, config("SECRET_KEY"), algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Credenciales invalidas",
        )
    user = crud.user.get(db, id=token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not crud.user.is_active(current_user):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def get_current_active_admin(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> User:
    """
    Obtén el usuario actualmente autenticado como administrador.

    Args:
        current_user (User): El usuario actualmente autenticado.
        db (Session): Una sesión de la base de datos.

    Returns:
        User: El usuario actualmente autenticado como administrador.

    Raises:
        HTTPException: Si el usuario no tiene suficientes privilegios (no es administrador).

    Example:
        Para obtener el usuario actualmente autenticado como administrador:
        ```
        admin_user: User = Depends(get_current_active_admin())
        ```
    """
    # Obtener el rol del usuario actual
    user_rol = db.query(UserRol).where(UserRol.user_id == current_user.id).first()
    rol_obj = db.query(Roles).where(Roles.rol_id == user_rol.rol_id).first()

    # Verificar si el usuario es administrador o tiene los privilegios adecuados
    if not crud.user.is_superuser(current_user) and rol_obj.name != RolName.ADMIN:
        raise HTTPException(
            status_code=400, detail="El usuario no tiene suficientes privilegios"
        )

    return current_user


# def get_current_active_superuser(
#     current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
# ) -> User:
#     user_rol = db.query(UserRol).where(UserRol.user_id == current_user.id).first()
#     rol_obj = db.query(Roles).where(Roles.rol_id == user_rol.rol_id).first()
#     if not crud.user.is_superuser(current_user) and rol_obj.name != RolName.ADMIN:
#         raise HTTPException(
#             status_code=400, detail="The user doesn't have enough privileges"
#         )
#     return current_user
