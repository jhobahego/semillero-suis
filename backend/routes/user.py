from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.exc import IntegrityError, DataError, OperationalError
from sqlalchemy.orm import Session, joinedload

from decouple import config
# from pymysql import OperationalError, DataError

from config.deps import get_current_active_admin, get_db

from crud.crud_user import user as crud_user
from schemas.User import User as UserSchema, UserCreate, UserResponse
from models.User import User

from utils.email import valid_email


router = APIRouter()


@router.post("/users", tags=["Users"], status_code=201, response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    admin_email = config("ADMIN_EMAIL")
    if not valid_email(user) and not user.email == admin_email:
        raise HTTPException(
            status_code=400,
            detail="Correo inválido, debes usar tu correo institucional",
        )

    db_user = crud_user.get_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Este correo ya ha sido registrado")

    try:
        db_user = crud_user.create(db=db, user=user)

        return db_user

    except IntegrityError as e:
        # Verificar si la excepción es debido a una violación de unicidad en la columna dni
        if "Duplicate entry" in str(e) and "for key 'dni'" in str(e):
            raise HTTPException(
                status_code=400,
                detail="Ya existe un usuario con este número de identificación (DNI)",
            )
        else:
            raise HTTPException(status_code=400, detail="Error en digitación, verifica tus datos.")

    except DataError as e:
        print(e)
        if "Out of range value for column 'dni' at row 1" in str(e):
            raise HTTPException(status_code=400, detail="Dni inválido, debes usar un número válido.")

    except OperationalError as e:
        print(e)
        raise HTTPException(status_code=400, detail="Datos invalidos, verifica tus datos")


@router.get(
    "/users/{id}",
    tags=["Users"],
    response_model=UserSchema,
    dependencies=[Depends(get_current_active_admin)],
)
def get_user(id: int, db: Session = Depends(get_db)):
    user_with_rol = (
        db.query(User).filter(User.id == id).options(joinedload(User.roles)).first()
    )

    if not user_with_rol:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return user_with_rol


@router.get(
    "/users",
    tags=["Users"],
    response_model=list[UserSchema],
    dependencies=[Depends(get_current_active_admin)],
)
def get_users(db: Session = Depends(get_db)):
    return crud_user.get_multi(db)


@router.delete("/users/{id}", tags=["Users"], status_code=204)
def delete_user(id: int, db: Session = Depends(get_db)):
    db_user = crud_user.remove(db=db, id=id)

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
