from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from fastapi.middleware.cors import CORSMiddleware

from routes import user, auth, project

from db import Base, engine

from decouple import config

Base.metadata.create_all(bind=engine)

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

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(project.router)


env_value = config("DEVELOPMENT_FRONTEND")

origins = env_value.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Home"], summary="Redirecciona a la pagina de la documentación")
def home():
    return RedirectResponse(url="/docs")
