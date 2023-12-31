from typing import Any, Optional, Union, Dict

from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.Event import Event
from schemas.Event import EventCreate, EventResponse, EventUpdate


class CRUDEvent(CRUDBase[Event, EventCreate, EventCreate]):
    def create(self, db: Session, *, obj_in: EventCreate) -> EventResponse:
        db_obj = Event(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: Event, obj_in: Union[EventUpdate, Dict[str, Any]]
    ) -> EventResponse:
        obj_data = obj_in.model_dump(exclude_unset=True)
        for field in obj_data:
            setattr(db_obj, field, obj_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> EventResponse:
        obj = db.query(self.model).get(id)
        db.delete(obj)
        db.commit()
        return obj

    def get(self, db: Session, *, id: int) -> Optional[EventResponse]:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> Any:
        return db.query(self.model).offset(skip).limit(limit).all()


event = CRUDEvent(Event)
