from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from crud.crud_project import project as crud_project
from crud.crud_user import user as crud_user
from schemas.Project import ProjectCreate, ProjectUpdate, Project
from config.deps import get_db, get_current_active_admin

router = APIRouter()


@router.post(
    "/projects/",
    tags=["Projects"],
    response_model=Project,
    dependencies=[Depends(get_current_active_admin)],
)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_user = crud_user.get(db=db, id=project.member_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return crud_project.create(db, obj_in=project)


@router.put(
    "/projects/{project_id}",
    tags=["Projects"],
    response_model=ProjectCreate,
    dependencies=[Depends(get_current_active_admin)],
)
def update_project(
    project_id: int, project: ProjectUpdate, db: Session = Depends(get_db)
):
    db_project = project.get(db, id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return crud_project.update(db, db_obj=db_project, obj_in=project)


@router.get("/projects/", tags=["Projects"], response_model=list[Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = crud_project.get_multi(db, skip=skip, limit=limit)
    return projects


@router.get("/projects/{project_id}", tags=["Projects"], response_model=Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud_project.get(db, id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return db_project
