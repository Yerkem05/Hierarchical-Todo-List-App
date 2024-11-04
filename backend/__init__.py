from flask import Flask
from models import db, User
from flask_cors import CORS
from flask_login import LoginManager
from tasks import tasks
from auth import auth
from lists import bp_list

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.register_blueprint(auth)
app.register_blueprint(tasks)
app.register_blueprint(bp_list)
login_manager = LoginManager()
login_manager.init_app(app)
app.secret_key ='secret-key'

@login_manager.user_loader
def load_user(user_id):
    return db.session.query(User).get(user_id)

db.init_app(app)
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True) 

