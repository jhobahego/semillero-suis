from sqlalchemy import Column, Integer, String, TIMESTAMP, Enum, ForeignKey, Boolean, func
from sqlalchemy.orm import relationship
from db import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    manager_id = Column(Integer, ForeignKey("users.id"))
    activity_type = Column(
        Enum("CUALIFICACION", "SEGUIMIENTO", "EVENTO", name="activity_type"),
        nullable=False,
    )
    title = Column(String(255), nullable=False)
    description = Column(String(255), nullable=False)
    color = Column(String(10), nullable=False)
    start = Column(TIMESTAMP, server_default=func.current_timestamp())
    finished_at = Column(TIMESTAMP)
    event_location = Column(String(150), nullable=False)
    duration = Column(Integer, nullable=False)
    active = Column(Boolean, default=True)

    manager = relationship("User", backref="events")
