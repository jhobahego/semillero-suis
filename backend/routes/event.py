from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from crud.crud_event import event
from crud.crud_user import user as crud_user
from schemas.Event import EventCreate, EventResponse
from schemas.User import UserResponse
from config.deps import get_current_active_admin, get_current_active_user, get_db

router = APIRouter()


@router.post(
    "/events/",
    tags=["Events"],
    status_code=201,
    response_model=EventResponse,
    dependencies=[Depends(get_current_active_admin)],
)
def create_event(event_data: EventCreate, db: Session = Depends(get_db)):
    manager_user = crud_user.get(db=db, id=event_data.manager_id)
    if manager_user is None:
        raise HTTPException(
            status_code=404,
            detail="El usuario no encontrado, debes usar un usuario registrado",
        )

    new_event = event.create(db=db, obj_in=event_data)

    return new_event


@router.get("/events", tags=["Events"], response_model=list[EventResponse])
def get_events(
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_active_user),
    skip=0,
    limit=100,
):
    return event.get_multi(db=db, skip=skip, limit=limit)
