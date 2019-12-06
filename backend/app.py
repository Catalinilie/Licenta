import jwt
from flask import render_template, request, redirect, url_for, Response, jsonify
from functools import wraps

from PlayingFieldModel import *
from SecurityModel import *
from UserModel import *
from settings import *

app.config['SECRET_KEY'] = "secret"


def getUserId(_token):
    return Security.getUserId(_token)


def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.args.get('token')
        try:
            jwt.decode(token, app.config['SECRET_KEY'])
            return f(*args, **kwargs)
        except:
            return jsonify({'error': "Need a valid token to view this page"}), 401

    return wrapper


@app.route('/')
@app.route('/login', methods=['POST'])
def get_token():
    requestData = json.loads(request.data)
    username = requestData["username"]
    password = requestData["password"]
    userId = None
    if User.usernameExist(username):
        userId = User.getUserIdByUsername(username)
    if User.username_password_match(username, password):
        token = jwt.encode({"": requestData}, app.config['SECRET_KEY'], algorithm='HS256')

        if not Security.verifyIfExist(userId, token):
            Security.createSecurityObject(userId, token)

        return token
    else:
        return Response('', 401, mimetype='application.json')


@app.route('/users', methods=['GET'])
def getAllUsers():
    users = User.getAllUsers()
    return users, 200


@app.route('/playingField', methods=['GET'])
@token_required
def getAllPlayingFields():
    return PlayingField.getAllPlayingFields(), 200


@app.route('/playingField', methods=['POST'])
@token_required
def createPlayingField():
    playingField = json.loads(request.data)
    PlayingField.createPlayingField(playingField["type"], playingField["numberOfPlayers"],
                                    getUserId(playingField["token"]))


@app.route('/')
@app.route('/register', methods=['POST'])
def register():
    Credential = json.loads(request.data)
    if User.usernameExist(Credential["username"]):
        return "User already exist.", 409
    if User.emailAlreadyExist(Credential["email"]):
        return "Email already used by another user.", 409
    else:
        User.create_user(
            Credential["email"],
            Credential["username"],
            Credential["firstName"],
            Credential["lastName"],
            Credential["password"]
        )
        return "User created with succes", 201


@app.route("/users/<int:userId>/edit/", methods=['GET', 'POST'])
def editUser(userId):
    editedUser = db.session.query(db.User).filter_by(id=userId).one()
    if request.method == 'POST':
        if request.form['name']:
            editedUser.title = request.form['name']
            return redirect(url_for('showUsers'))
    else:
        return render_template('editUsers.html', user=editedUser)


@app.route('/users/<int:user_id>/delete/', methods=['DELETE'])
@token_required
def deleteUser(user_id):
    result = User.deleteUser(user_id)
    if result == False:
        return "No user with id " + user_id + " exist.", 404
    else:
        return "User deleted with succes.", 200


@app.route('/users/<int:user_id>/update', methods=['PATCH'])
@token_required
def updateUser(user_id):
    data = json.loads(request.data)

    if "password" in data and "username" in data:
        user = User.updatePassword(user_id, data["password"],data["username"])
        if not user:
            return "User does not exist.", 404
        else:
            return "Username and password updated with success.", 200

    if "password" in data:
        user = User.updatePassword(user_id, data["password"])
        if not user:
            return "User does not exist.", 404
        else:
            return "User password updated with success.", 200
    if "username" in data:
        user = User.updateUserName(user_id, data["username"])
        if user == False:
            return "User does not exist.", 404
        else:
            return "Username updated with success.", 200


def get_users():
    users = db.session.query(db.User).all()
    return jsonify(users=[b.serialize for b in users])


def get_user(user_id):
    users = db.session.query(db.User).filter_by(id=user_id).one()
    return jsonify(users=users.serialize)


def makeANewUser(title, author, genre):
    addeduser = db.User(title=title, author=author, genre=genre)
    db.session.add(addeduser)
    db.session.commit()
    return jsonify(User=addeduser.serialize)


def updateUser(id, title, author, genre):
    updatedUser = db.session.query(db.User).filter_by(id=id).one()
    if not title:
        updatedUser.title = title
    if not author:
        updatedUser.author = author
    if not genre:
        updatedUser.genre = genre
    db.session.add(updatedUser)
    db.session.commit()
    return 'Updated a User with id %s' % id


def deleteAUser(id):
    userToDelete = db.session.query(db.User).filter_by(id=id).one()
    db.session.delete(userToDelete)
    db.session.commit()
    return 'Removed User with id %s' % id


@app.route('/')
@app.route('/usersApi', methods=['GET', 'POST'])
def usersFunction():
    if request.method == 'GET':
        return get_users()
    elif request.method == 'POST':
        title = request.args.get('title', '')
        author = request.args.get('author', '')
        genre = request.args.get('genre', '')
        return makeANewUser(title, author, genre)


@app.route('/usersApi/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def userFunctionId(id):
    if request.method == 'GET':
        return get_user(id)

    elif request.method == 'PUT':
        title = request.args.get('title', '')
        author = request.args.get('author', '')
        genre = request.args.get('genre', '')
        return updateUser(id, title, author, genre)

    elif request.method == 'DELETE':
        return deleteUser(id)


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=4996)
