from flask_sqlalchemy import SQLAlchemy
from settings import app
import json

db = SQLAlchemy(app)


class Security(db.Model):
    __tablename__ = 'Security'

    id = db.Column(db.Integer, primary_key=True, unique=True)
    userId = db.Column(db.Integer, nullable=False)
    token = db.Column(db.String, nullable=False)

    def __repr__(self):
        security_object = str({
            "userId": self.userId,
            "token": self.token
        })
        return json.dumps(security_object)

    def getUserId(_token):
        return json.dumps(Security.query.filter_by(token=_token).first())

    def verifyIfExist(_userId, _token):
        securityObject = Security.query.filter_by(userId=_userId).filter_by(token=_token).first()
        if securityObject is None:
            return False
        else:
            return True

    def createSecurityObject(_userId, _token):
        securityObject = Security(userId=_userId, token=_token)
        db.session.add(securityObject)
        db.session.commit()