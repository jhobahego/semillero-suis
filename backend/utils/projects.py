from typing import Union
from sqlalchemy.orm import Session

from crud.crud_project import project as crud_project
from crud.crud_user import user as crud_user


def validate_existing_members(
    db: Session, members_dni: list[int]
) -> Union[list[str], list]:
    """
    Valida si los DNI (Documento Nacional de Identidad) de los miembros proporcionados existen en algún proyecto en la base de datos.

    Parámetros:
    - db: El objeto de la base de datos.
    - members_dni: Una lista de DNIs a validar.

    Retorna:
    - Una lista de DNIs de miembros existentes
      o una lista vacia en caso de que no haya miembros.

    Ejemplo:
    >>> db = ...
    >>> members_dni = ['12345678', '87654321', '98765432']
    >>> validate_existing_members(db, members_dni)
    ['12345678', '98765432']
    """
    dnis_with_projects = [
        dni for proj in crud_project.get_multi(db) for dni in proj.members
    ]
    existing_members = [dni for dni in members_dni if dni in dnis_with_projects]
    return existing_members


def validate_existing_users(
    db: Session, members_dni: list[int]
) -> Union[list[str], list]:
    """
    Valida los usuarios existentes en la base de datos.

    Parámetros:
    - db: La base de datos a consultar.
    - members_dni: Una lista de DNIs de los miembros a validar.

    Retorna:
    - non_existing_members: Una lista de DNIs de los miembros que no existen en la base de datos
      o una lista vacia en caso de que los members_dni si esten registrados en la base de datos.
    """
    user_dnies = [user.dni for user in crud_user.get_multi(db)]
    non_existing_members = [dni for dni in members_dni if dni not in user_dnies]
    return non_existing_members


def fetch_existing_project_titles(db: Session) -> Union[list[str], list]:
    """
    Obtiene los títulos de los proyectos existentes.

    Parámetros:
    - db: Sesión de la base de datos.

    Retorna:
    - Una lista de cadenas de texto con los títulos de los proyectos existentes
      o una lista vacia en caso de que no haya proyectos registrados con ese titulo.
    """
    project_titles = [project.title for project in crud_project.get_multi(db)]

    return project_titles
