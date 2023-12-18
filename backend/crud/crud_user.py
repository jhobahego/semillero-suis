from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session, joinedload

from decouple import config

from crud.base import CRUDBase
from models.User import Roles, User, RolName, Autority
from schemas.User import UserCreate, UserUpdate
from config.security import get_password_hash, verify_password


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
        else:
            rol_name = user.rol

        created_user = User(
            dni=user.dni,
            name=user.name,
            lastname=user.lastname,
            email=user.email,
            hashed_password=get_password_hash(user.password),
            phone_number=user.phone_number,
            university=user.university,
            university_site=user.university_site,
            semester=user.semester,
            program=user.program,
            faculty=user.faculty,
            research_team=user.research_team,
            is_superuser=(rol_name == RolName.GESTOR),
        )

        if rol_name:
            rol = Roles(name=rol_name, authorities=authorities)
            created_user.roles = [rol]

            db.add_all([created_user, rol])
            db.commit()

        db.refresh(created_user)
        created_user = (
            db.query(User)
            .options(joinedload(User.roles))
            .filter_by(id=created_user.id)
            .first()
        )

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
