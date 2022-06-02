from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from datetime import datetime

db = SQLAlchemy()

class Users(UserMixin, db.Model):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    #unique = true means unique username only
    password = db.Column(db.String(256), nullable=False)
    is_Admin = db.Column(db.Boolean, nullable=False, default=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    class Conversions(UserMixin, db.Model):
        __tablename__ = 'Conversions'
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer)
        username = db.Column(db.String(50), nullable=False)
        fromCurrency = db.Column(db.String(3), nullable=False)
        toCurrency = db.Column(db.String(3), nullable=False)
        fromValue = db.Column(db.String(20), nullable=False)
        toValue = db.Column(db.String(20), nullable=False)
        rate = db.Column(db.String(15), nullable=False)
        date_saved = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        template = '{0.user_id} {0.username} {0.fromCurrency} {0.toCurrency} {0.fromValue} {0.toValue} {0.rate} {0.date_saved}'
        return template.format(self)