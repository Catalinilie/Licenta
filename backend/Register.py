import DBClient
import datetime


def verifyIfUserExist(credential):
    result = DBClient.session.query(DBClient.User).filter_by(email=credential["email"]).first()
    return result is not None


def createNewUser(credetial):
    newUser = DBClient.User(id=credetial["id"],
                            userName=credetial["userName"],
                            password_hash=credetial["password"],
                            email=credetial["email"],
                            firstName=credetial["firstName"],
                            lastName=credetial["lastName"],
                            createdOn=datetime.datetime.now(),
                            updatedOn=datetime.datetime.now())
    DBClient.session.add(newUser)
    DBClient.session.commit()

def changePassword(credential, newPassword):
    if verifyIfUserExist(credential):
        user = DBClient.session.query(DBClient.User).filter(DBClient.User.userName==credential["userName"]).one()
        user.password_hash = newPassword

        DBClient.session.commit()
    else:
        raise Exception("The user with username: " + credential["userName"] + " doesn't exist.")
