from pydantic import BaseModel, constr, ConfigDict
from datetime import datetime
from enum import Enum
from typing import Optional


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


class EventUpdate(BaseModel):
    activity_type: Optional[EventActivity]
    title: Optional[str]
    description: Optional[str]
    manager_id: Optional[int]
    color: Optional[str]
    start: Optional[datetime]
    finished_at: Optional[datetime]
    event_location: Optional[str]
    duration: Optional[int]
