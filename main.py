import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

# Absolute path for the database file
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", "instance", "users.db") # Store db in instance folder
INSTANCE_FOLDER_PATH = os.path.join(BASE_DIR, "..", "instance")

if not os.path.exists(INSTANCE_FOLDER_PATH):
    os.makedirs(INSTANCE_FOLDER_PATH)

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    # DO NOT CHANGE THIS !!!
    import sys
    sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

    app = Flask(__name__, instance_relative_config=True, instance_path=INSTANCE_FOLDER_PATH)
    app.config["SECRET_KEY"] = os.urandom(24) # Securely generated secret key
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login" # Specify the login view
    login_manager.login_message = "الرجاء تسجيل الدخول للوصول إلى هذه الصفحة."
    login_manager.login_message_category = "info"


    from src.models.user import User
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprints
    from src.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")

    from src.routes.main import main_bp
    app.register_blueprint(main_bp)

    with app.app_context():
        db.create_all() # Create database tables if they don't exist

    return app

