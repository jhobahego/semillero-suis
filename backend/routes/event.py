from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from crud.crud_event import event
from crud.crud_user import user as crud_user
from schemas.Event import EventCreate, EventResponse, EventUpdate
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


@router.get("/events/{id}", tags=["Events"], response_model=EventResponse)
def get_event(
    id: int,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_active_user),
):
    return event.get(db=db, id=id)


@router.put(
    "/users{event_id}",
    tags=["Events"],
    status_code=200 | 404,
    response_model=EventResponse,
)
def update_event(
    *,
    event_id: int,
    event_in: EventUpdate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_active_admin),
):
    db_event = event.get(db, id=event_id)
    if not db_event:
        raise HTTPException(
            status_code=404,
            detail=f"Evento con id: ${event_id} no encontrado",
        )

    return event.update(db=db, db_obj=db_event, obj_in=event_in)
