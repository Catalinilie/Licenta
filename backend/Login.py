import DBClient


def login(credential):
    user = DBClient.session.query(DBClient.User).filter_by(DBClient.User.userName == credential["userName"]).one()
    password = DBClient.session.query(DBClient.User).filter_by(DBClient.User.password_hash == credential["password_hash"]).one()

    if user.password_hash == password