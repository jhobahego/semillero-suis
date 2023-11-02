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
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    project_link: Optional[str]
    portrait_url: Optional[str]
    status: Optional[ProjectStatus]


class ProjectCreate(BaseModel):
    member_id: int
    title: str
    description: str
    general_objectives: List[str]
    specific_objectives: List[str]
    project_type: ProjectType
    status: ProjectStatus


class ProjectUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    general_objectives: Optional[List[str]]
    specific_objectives: Optional[List[str]]
    finished_at: Optional[datetime]
    project_link: Optional[str]
    portrait_url: Optional[str]
    status: Optional[ProjectStatus]


class Project(ProjectBase):
    id: int
    member_id: int

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
