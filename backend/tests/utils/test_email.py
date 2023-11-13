from schemas.User import UserCreate
from utils.email import valid_email


# Returns False if user's email is not valid or does not match any email format
def test_invalid_email():
    user = UserCreate(
        dni=1038836028,
        name="John Doe",
        lastname="Smith Second",
        email="john.doe@gmail.com",
        password="password",
        university="Remington",
        sede="Sincelejo",
    )
    student = UserCreate(
        dni=100388360,
        name="John Doe",
        lastname="Smith Second",
        email="john.doe.8360@miremington.com",
        password="password",
        university="Remington",
        sede="Sincelejo",
    )
    student2 = UserCreate(
        dni=100388360,
        name="John Doe",
        lastname="Smith Second",
        email="john.smith.8363@miremington.edu.co",
        password="password",
        semester=6,
        university="Remington",
        sede="Sincelejo",
    )

    assert valid_email(user) is False
    assert valid_email(student) is False
    assert valid_email(student2) is False


# Returns True if user's email is valid and matches student email format
def test_valid_student_email():
    user = UserCreate(
        dni=1038836028,
        name="John Second",
        lastname="Doe Smith",
        email="john.doe.6028@miremington.edu.co",
        password="password",
        semester=4,
        university="Remington",
        sede="Sincelejo",
    )
    assert valid_email(user) is not True


# Returns True if user's email is valid and matches teacher email format
def test_valid_teacher_email():
    user = UserCreate(
        dni=1038836028,
        name="John Second",
        lastname="Doe Smith",
        email="john.doe@uniremington.edu.co",
        password="password",
        university="Remington",
        sede="Sincelejo",
    )
    assert valid_email(user) is not True
