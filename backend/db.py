from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from decouple import config

mode = config("RUN_ENV")

SQLALCHEMY_DATABASE_URL = ""

if mode == "test":
    SQLALCHEMY_DATABASE_URL = config("TEST_DATABASE_URL")
else:
    SQLALCHEMY_DATABASE_URL = config("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
