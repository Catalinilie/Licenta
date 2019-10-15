from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, func

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import relationship

from sqlalchemy import create_engine

Base = declarative_base()


class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True)
    userName = Column(String(50), nullable=False)
    password_hash = Column(String(128))
    firstName = Column(String(70), nullable=False)
    lastName = Column(String(70), nullable=False)
    createdOn = Column(DateTime, server_default=func.now())
    updatedOn = Column(DateTime, server_default=func.now(), server_onupdate=func.now())

    @property
    def serialize(self):
        return {
            'id': self.id,
            'userName': self.userName,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'password_hash': self.password_hash,
            'createdOn': self.createdOn,
            'updatenOn': self.updatedOn,
        }


class PlayingField(Base):
    __tablename__ = 'Field'

    id = Column(Integer, primary_key=True)
    type = Column(String(250), nullable=False)
    numberOfPlayers = Column(Integer, nullable=False)
    userId = Column(Integer, ForeignKey("User.id"), nullable=False)
    createdOn = Column(DateTime, server_default=func.now())
    updatedOn = Column(DateTime, server_default=func.now(), server_onupdate=func.now())

    @property
    def serialize(self):
        return {
            'id': self.id,
            'type': self.type,
            'numberOfPlayers': self.numberOfPlayers,
            'userId': self.userId,
            'createdOn': self.createdOn,
            'updatenOn': self.updatedOn,
        }


class Availability(Base):
    __tablename__ = 'Availability'

    id = Column(Integer, primary_key=True)
    createdOn = Column(DateTime, server_default=func.now())
    updatedOn = Column(DateTime, server_default=func.now(), server_onupdate=func.now())


# creates a create_engine instance at the bottom of the file
engine = create_engine('sqlite:///database.db')
Base.metadata.create_all(engine)
