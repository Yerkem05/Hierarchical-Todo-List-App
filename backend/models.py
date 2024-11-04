from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>, lists: {self.lists}'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'lists': [list.to_dict() for list in self.lists]
        }


class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tasks = db.relationship('ListItem', backref='list', lazy=True)

    def to_dict(self):
        tasks = []

        for task in self.tasks:
            if task.parent_id is None:
                tasks.append(task.as_dict())

        return {
            'id': self.id,
            'name': self.name,
            'tasks': tasks
        }


class ListItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    task_depth = db.Column(db.Integer, default=0)
    parent_id = db.Column(db.Integer, db.ForeignKey('list_item.id'), nullable=True)
    children = db.relationship('ListItem', backref=db.backref('parent', remote_side=[id]), lazy=True)


    def as_dict(self):
        """ Recursively converts task and its children to a dictionary for easy JSON serialization """
        return {
            'id': self.id,
            'name': self.name,
            'list_id': self.list_id,
            'task_depth': self.task_depth,
            'completed': self.completed,
            'parent_id': self.parent_id,
            'children': [child.as_dict() for child in self.children],
        }

    