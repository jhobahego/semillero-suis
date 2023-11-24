from pydantic import BaseModel, constr, ConfigDict
from datetime import datetime
from enum import Enum


class EventActivity(str, Enum):
    CUALIFICACION = "CUALIFICACION"
    SEGUIMIENTO = "SEGUIMIENTO"
    EVENTOS = "EVENTOS"


class EventBase(BaseModel):
    activity_type: EventActivity
    title: str
    description: str
    manager_id: int
    color: constr(max_length=10)
    start: datetime
    finished_at: datetime | None = None
    event_location: constr(max_length=150)
    duration: int


class EventCreate(EventBase):
    pass


class EventResponse(EventBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
