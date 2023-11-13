from fastapi.testclient import TestClient
from schemas.User import UserCreate
from utils.email import valid_email

from app.main import app

import pytest


@pytest.fixture()
def client():
    return TestClient(app)


# Create a student with valid input data
def test_create_student_valid_data(client: TestClient):
    # Arrange
    student = {
        "dni": 1038836028,
        "name": "John Primary",
        "lastname": "Doe Second",
        "email": "john.doe.6028@miremington.edu.co",
        "password": "password123",
        "semester": 4,
        "university": "Remington",
        "sede": "Sincelejo",
    }

    # Act
    response = client.post(
        "/users",
        json=student,
        headers={"Accept": "application/json"},
    )

    # Assert
    assert response.status_code == 201
    assert response.json()["name"] == student["name"]
    assert response.json()["email"] == student["email"]
    assert response.json()["is_active"] is True
    assert response.json()["is_superuser"] is False

    if response.status_code == 201:
        id = response.json()["id"]
        client.delete(f"/users/{id}")


# Create a teacher with valid data
def test_create_teacher_valid_data(client: TestClient):
    # Arrange
    teacher_data = {
        "dni": 1038836028,
        "name": "John Primary",
        "lastname": "Doe Second",
        "email": "john.doe@uniremington.edu.co",
        "password": "password123",
        "university": "Remington",
        "sede": "Sincelejo",
    }

    # Act
    response = client.post(
        "/users",
        json=teacher_data,
        headers={"Accept": "application/json"},
    )

    # Assert
    assert response.status_code == 201
    assert response.json()["name"] == teacher_data["name"]
    assert response.json()["email"] == teacher_data["email"]
    assert response.json()["is_active"] is True
    assert response.json()["is_superuser"] is False

    if response.status_code == 201:
        id = response.json()["id"]
        client.delete(f"/users/{id}")


# Create multiple users with valid input data
def test_create_teacher_with_exist_email_be_fail(client: TestClient):
    # Arrange
    teacher_data_1 = {
        "dni": 1038836028,
        "name": "John Primary",
        "lastname": "Doe Second",
        "email": "john.doe@uniremington.edu.co",
        "password": "password123",
        "university": "Remington",
        "sede": "Sincelejo",
    }
    teacher_data_2 = {
        "dni": 1038836028,
        "name": "John Primary",
        "lastname": "Doe Second",
        "email": "john.doe@uniremington.edu.co",
        "password": "password123",
        "university": "Remington",
        "sede": "Sincelejo",
    }

    # Act
    response_1 = client.post("/users", json=teacher_data_1)
    response_2 = client.post("/users", json=teacher_data_2)

    # Assert
    assert response_1.status_code == 201

    assert response_2.status_code == 400
    assert response_2.json()["detail"] == "Este correo ya ha sido registrado"

    if response_1.status_code == 201:
        id1 = response_1.json()["id"]
        client.delete(f"/users/{id1}")


# Verify student has not create with existing dni
def test_student_with_duplicate_dni(client: TestClient):
    new_teacher = {
        "dni": 123456789,
        "name": "profesor",
        "lastname": "nuevo",
        "email": "profesor.nuevo@uniremington.edu.co",
        "password": "password789",
        "university": "Remington",
        "sede": "Bogota",
    }

    # Crear el primer usuario
    created_teacher = client.post("/users", json=new_teacher)

    # Datos de un usuario con un DNI que ya existe en la base de datos
    existing_teacher = {
        "dni": 123456789,
        "name": "profe conDNI",
        "lastname": "existente enBD",
        "email": "profe.existente@uniremington.edu.co",
        "password": "password789",
        "university": "Remington",
        "sede": "Medellin",
    }

    # Intentar crear el segundo usuario con el mismo DNI
    response = client.post("/users", json=existing_teacher)

    # Verificar que el servidor devuelve un código de error 400 en caso de DNI duplicado
    assert response.status_code == 400
    assert (
        "Ya existe un usuario con este número de identificación (DNI)" in response.text
    )

    # Asegurarse de que se eliminó el primer usuario creado
    if created_teacher.status_code == 201:
        id = created_teacher.json()["id"]
        client.delete(f"/users/{id}")
