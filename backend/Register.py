import DBClient
import datetime

def verifyIfUserExist(Credential):
    result = DBClient.session.query()
    return result.size != 0


def createNewUser(Credetial):
    newUser = DBClient.User(id=Credetial.id,
                            userName=Credetial.userName,
                            password_hash=Credetial.password,
                            firstName=Credetial.firstName,
                            lastName=Credetial.lastName,
                            createdOn=datetime.datetime.now(),
                            updatedOn=datetime.datetime.now())
    DBClient.session.add(newUser)
    DBClient.session.commit()
