from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user
from models import User, db

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user)
            return jsonify({"Message": "Login success"}), 201
    except Exception as e:
        return jsonify({"Message": "Login failed"}), 400

@auth.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        username = request.form.get('username')
        password = request.form.get('password')
        if User.query.filter_by(username=username).first():
            return jsonify({"Message": "User already exist"}), 400 

        new_user = User(username=username)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"Message": "Sing up success"}), 201
    except Exception as e:
        return jsonify({"Message": "Sing up failed"}), 400
    


@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    try:
        logout_user()
        return jsonify({"Message": "Logout success"}), 201
    except Exception as e:
        return jsonify({"Message": "Logout failed"}), 400 


