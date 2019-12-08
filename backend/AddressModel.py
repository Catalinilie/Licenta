import uuid
import json
from flask_sqlalchemy import SQLAlchemy
from settings import app

db = SQLAlchemy(app)


def generateUUID():
    return str(uuid.uuid4())


class Address(db.Model):
    __tablename__ = 'Address'

    id = db.Column(db.String, primary_key=True, unique=True)
    playingFieldId = db.Column(db.String, nullable=False)
    street = db.Column(db.String(80), nullable=False)
    streetNr = db.Column(db.String(8), nullable=False)
    city = db.Column(db.String(60), nullable=False)
    region = db.Column(db.String(60), nullable=False)
    country = db.Column(db.String(60), nullable=False)
    addressCode = db.Column(db.String(10), nullable=False)

    def json(self):
        return {
            "id": self.id,
            "playingFieldId": self.playingFieldId,
            "street": self.street,
            "streetNr": self.streetNr,
            "city": self.city,
            "region": self.region,
            "country": self.country,
            "addressCode": self.addressCode
        }

    def __repr__(self):
        address_object = str({
            "id": self.id,
            "playingFieldId": self.playingFieldId,
            "street": self.street,
            "streetNr": self.streetNr,
            "city": self.city,
            "region": self.region,
            "country": self.country,
            "addressCode": self.addressCode
        })
        return json.dumps(address_object)

    def addressExist(_street, _streetNr, _city, _region, _country, _addressCode):
        return Address.query.filter_by(street=_street) \
            .filter_by(streetNr=_streetNr) \
            .filter_by(city=_city) \
            .filter_by(region=_region) \
            .filter_by(country=_country) \
            .filter_by(addressCode=_addressCode).first()

    def createAddress(_playingFieldId, _street, _streetNr, _city, _region, _country, _addressCode):
        _id = generateUUID()
        if Address.query.filter_by(id=_id).first() is None:
            newAddress = Address(
                id=_id,
                playingFieldId=_playingFieldId,
                street=_street,
                streetNr=_streetNr,
                city=_city,
                region=_region,
                country=_country,
                addressCode=_addressCode
            )
            db.session.add(newAddress)
            db.session.commit()
            return _id
        else:
            Address.createAddress(_playingFieldId, _street, _streetNr, _city, _region, _country, _addressCode)

    def updateAddress(Address):
        address = Address.query.filter_by(id=Address.id).first()
        address.street = Address.street
        address.streetNr = Address.streetNr
        address.city = Address.city
        address.region = Address.region
        address.country = Address.country
        address.addressCode = Address.addressCode

        db.session.commit()

    def getAddressByPlayingFieldId(_playingFieldId):
        address = Address.query.filter_by(playingFieldId=_playingFieldId).first()

        if address is None:
            return "No address found for playingField with id: " + _playingFieldId, 404
        else:
            return address.json()
