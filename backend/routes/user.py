from fastapi import Depends, APIRouter, HTTPException

from sqlalchemy.orm import Session
from config.deps import get_db

from crud.crud_user import user as crud_user
from schemas.User import User, UserCreate

from config.deps import get_current_active_admin


router = APIRouter()


@router.post("/users", tags=["Users"], response_model=User)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    db_user = crud_user.get_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud_user.create(db=db, user=user)


@router.get("/users/{id}", tags=["Users"], response_model=User)
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
