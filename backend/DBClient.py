from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, User

# Connect to Database and create database session
engine = create_engine('sqlite:///database.db.db?check_same_thread=False')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()
