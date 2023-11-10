from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from decouple import config

from crud.base import CRUDBase
from models.User import Roles, User, UserRol, RolName, Autority
from schemas.User import UserCreate, UserUpdate
from config.security import get_password_hash, verify_password

from utils.email import is_teacher


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def create(self, db: Session, *, user: UserCreate) -> User:
        authorities = [Autority.READ, Autority.CHANGE_CREDENTIALS]
        gestor_email = config("GESTOR_EMAIL")

        rol_name = ""
        if user.email == gestor_email:
            rol_name = RolName.GESTOR
            authorities.append(Autority.CREATE)
            authorities.append(Autority.MODIFY)
            authorities.append(Autority.DELETE)

        elif is_teacher(user.email):
            rol_name = RolName.TEACHER
        else:
            rol_name = RolName.STUDENT

        created_user = User(
            dni=user.dni,
            name=user.name,
            lastname=user.lastname,
            email=user.email,
            hashed_password=get_password_hash(user.password),
            semester=user.semester,
            university=user.university,
            sede=user.sede,
            is_superuser=(rol_name == RolName.GESTOR),
        )

        db.add(created_user)
        db.commit()
        db.refresh(created_user)

        rol = Roles(name=rol_name, authorities=authorities)
        db.add(rol)
        db.commit()

        user_rol = UserRol(user_id=created_user.id, rol_id=rol.rol_id)
        db.add(user_rol)
        db.commit()

        return created_user

    def update(
        self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        if update_data["password"]:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser


user = CRUDUser(User)
