from schemas.User import UserCreate
import re


def valid_email(user: UserCreate):
    first_name = user.name.split()[0] if user.name else ""
    first_lastname = user.lastname.split()[0] if user.lastname else ""
    
    full_name = f"{first_name.lower()}.{first_lastname.lower()}"

    student_email = f"{full_name}.{user.dni % 10000}@miremington.edu.co"
    teacher_email = f"{full_name}@uniremington.edu.co"

    valid_email_regex = re.compile(
        r"^[a-z]+\.[a-z]+\.\d{4}@miremington\.edu\.co$|^[a-z]+\.[a-z]+@uniremington\.edu\.co$"
    )

    return user.email in {student_email, teacher_email} and valid_email_regex.match(
        user.email
    )


def is_teacher(email: str):
    value = re.compile(r"^[a-z]+\.[a-z]+@uniremington\.edu\.co$").match(email)
    
    return True if value else False