from fastapi import Depends, APIRouter, HTTPException
from fastapi.responses import JSONResponse

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from config.deps import get_current_active_admin, get_db

from crud.crud_user import user as crud_user
from schemas.User import User, UserCreate, UserInDB

from utils.email import valid_email


router = APIRouter()


@router.post("/users", tags=["Users"], response_model=UserInDB)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    if not valid_email(user):
        raise HTTPException(
            status_code=400,
            detail="Correo inválido, debes usar tu correo institucional",
        )

    db_user = crud_user.get_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Este correo ya ha sido registrado")

    try:
        db_user = crud_user.create(db=db, user=user)
        response = {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "is_active": db_user.is_active,
            "is_superuser": db_user.is_superuser,
        }
        return JSONResponse(status_code=201, content=response)

    except IntegrityError as e:
        # Verificar si la excepción es debido a una violación de unicidad en la columna dni
        if "Duplicate entry" in str(e) and "for key 'dni'" in str(e):
            raise HTTPException(
                status_code=400,
                detail="Ya existe un usuario con este número de identificación (DNI)",
            )
        else:
            # Si no es una violación de unicidad en la columna dni, re-raise la excepción
            raise


@router.get("/users/{id}", tags=["Users"], response_model=UserInDB)
def get_user(id: int, db: Session = Depends(get_db)):
    db_user = crud_user.get(db, id)

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get(
    "/users",
    tags=["Users"],
    response_model=list[User],
    dependencies=[Depends(get_current_active_admin)],
)
def get_users(db: Session = Depends(get_db)):
    return crud_user.get_multi(db)
