from fastapi import FastAPI
from fastapi.responses import RedirectResponse

app = FastAPI()

app.title = "Api del semillero SUIS"
app.description = (
    "Esta API proporciona acceso a las funcionalidades del Semillero SUIS."
)
app.version = "0.0.1"
app.openapi_tags = [
    {"name": "Home", "description": "Documentation"},
    {"name": "Users", "description": "Users routes"},
    {"name": "Projects", "description": "Projects routes"},
]


@app.get(
    "/",
    tags=["Home"],
    summary="Redirecciona a la pagina de la documentación"
)
def home():
    return RedirectResponse(url="/docs")
