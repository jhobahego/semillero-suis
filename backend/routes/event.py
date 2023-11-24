from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from crud.crud_event import event
from schemas.Event import EventCreate, EventResponse
from config.deps import get_current_active_admin, get_db

router = APIRouter()


@router.post(
    "/events/",
    tags=["Events"],
    status_code=201,
    response_model=EventResponse,
    dependencies=[Depends(get_current_active_admin)],
)
def create_event(event_data: EventCreate, db: Session = Depends(get_db)):
    try:
        new_event = event.create(db=db, obj_in=event_data)

        return new_event
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al crear el evento: {str(e)}"
        )
