from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, JSON
from sqlalchemy import orm, sql
from enum import Enum as PyEnum

from db import Base


class ProjectStatus(PyEnum):
    PENDING = "PENDING"
    IN_PROCESS = "IN_PROCESS"
    DONE = "DONE"


class ProjectType(PyEnum):
    INVESTIGACION = "INVESTIGACION"
    INNOVACION = "INNOVACION"
    EXTENCION = "EXTENSION"
    EMPRENDIMIENTO = "EMPRENDIMIENTO"


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(300), nullable=False)
    general_objectives = Column(JSON, nullable=False)
    specific_objectives = Column(JSON, nullable=False)
    project_type = Column(Enum(ProjectType), default=ProjectType.INVESTIGACION)
    started_at = Column(DateTime, default=sql.func.now())
    finished_at = Column(DateTime)
    project_link = Column(String(300))
    portrait_url = Column(String(300))
    status = Column(Enum(ProjectStatus), default=ProjectStatus.PENDING)

    # Definición de la clave foránea para la relación many-to-one
    member_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Definición de la relación many-to-one con la tabla Users
    member = orm.relationship("User", back_populates="projects")
