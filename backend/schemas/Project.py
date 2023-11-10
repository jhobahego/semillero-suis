from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

from models.Project import ProjectStatus, ProjectType


class ProjectBase(BaseModel):
    title: str
    description: str
    general_objectives: List[str]
    specific_objectives: List[str]
    project_type: ProjectType
    started_at: datetime
    finished_at: datetime | None
    project_link: str | None
    portrait_url: str | None
    status: ProjectStatus


class ProjectCreate(BaseModel):
    title: str
    description: str
    members: List[int]
    general_objectives: List[str]
    specific_objectives: List[str]
    project_type: ProjectType
    project_link: str | None = None
    portrait_url: str | None = None
    status: ProjectStatus = ProjectStatus.PENDING


class ProjectUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    general_objectives: Optional[List[str]]
    specific_objectives: Optional[List[str]]
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    project_type: Optional[ProjectType]
    project_link: Optional[str]
    portrait_url: Optional[str]
    status: Optional[ProjectStatus]


class Project(ProjectBase):
    id: int
    members: List[int]

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
