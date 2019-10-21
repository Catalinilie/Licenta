import uuid
from datetime import datetime

from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, User

# Connect to Database and create database session
engine = create_engine('sqlite:///database.db.db?check_same_thread=False')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()


# landing page that will display all the users in our database
# This function will operate on the Read operation.
@app.route('/')
@app.route('/users')
def showFirstPage():
    users = session.query(User).all()
    return render_template('users.html', users=users)


@app.route('/')
@app.route('/login')
def showLogin():
    users = session.query(User).all()
    return render_template('users.html', users=users)


# This will let us Create a new user and save it in our database
@app.route('/users/new/', methods=['GET', 'POST'])
def newUser():
    if request.method == 'POST':
        newUser = User(id=uuid.uuid1(),
                       username=request.form['username'],
                       password_hash=request.form['password'],
                       firstName=request.form['firstName'],
                       createdOn=datetime.now(),
                       updatedOn=datetime.now())
        session.add(newUser)
        session.commit()
        return redirect(url_for('showFirstPage'))
    else:
        return render_template('newUser.html')


# This will let us Update our user and save it in our database
@app.route("/users/<int:userId>/edit/", methods=['GET', 'POST'])
def editUser(userId):
    editedUser = session.query(User).filter_by(id=userId).one()
    if request.method == 'POST':
        if request.form['name']:
            editedUser.title = request.form['name']
            return redirect(url_for('showUsers'))
    else:
        return render_template('editUsers.html', user=editedUser)


# This will let us Delete our user
@app.route('/users/<int:user_id>/delete/', methods=['GET', 'POST'])
def deleteUser(user_id):
    userToDelete = session.query(User).filter_by(id=user_id).one()
    if request.method == 'POST':
        session.delete(userToDelete)
        session.commit()
        return redirect(url_for('showUsers', user_id=user_id))
    else:
        return render_template('deleteUser.html', user=userToDelete)


"""
api functions
"""
from flask import jsonify


def get_users():
    users = session.query(User).all()
    return jsonify(users=[b.serialize for b in users])


def get_user(user_id):
    users = session.query(User).filter_by(id=user_id).one()
    return jsonify(users=users.serialize)


def makeANewUser(title, author, genre):
    addeduser = User(title=title, author=author, genre=genre)
    session.add(addeduser)
    session.commit()
    return jsonify(User=addeduser.serialize)


def updateUser(id, title, author, genre):
    updatedUser = session.query(User).filter_by(id=id).one()
    if not title:
        updatedUser.title = title
    if not author:
        updatedUser.author = author
    if not genre:
        updatedUser.genre = genre
    session.add(updatedUser)
    session.commit()
    return 'Updated a User with id %s' % id


def deleteAUser(id):
    userToDelete = session.query(User).filter_by(id=id).one()
    session.delete(userToDelete)
    session.commit()
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
