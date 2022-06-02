from flask import Flask, render_template, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from wtforms import StringField,PasswordField,SubmitField
from wtforms.validators import InputRequired,Length,ValidationError
from flask_wtf import FlaskForm
from models import Users
from flask_bcrypt import Bcrypt
app = Flask(__name__)

#Config Database

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///user.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY']='secretkey'

db = SQLAlchemy(app)

#So we can hash passwords
bcrypt=Bcrypt(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))
#------------------------------ROUTING------------------------------------------------------------------------
#on initial run go to the index page
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/history')
def history():
    return render_template('history.html')
    
@app.route('/news')
def news():
    return render_template('news.html')



# --------------------------------REGISTER & LOGIN ACCOUNT FORMS -----------------------------------------------
# registration form for user:
class RegisterForm(FlaskForm):
    username = StringField(validators=[
                           InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})
# User must meet the requirments to register an account otherwise it will keep prompting them to enter the right details
#Username length min of 4 char max of 20 password = min of 8 char max of 20
    password = PasswordField(validators=[
                             InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})

    submit = SubmitField('Register')

    def validate_username(self, username):
        existing_user_username = Users.query.filter_by(
            username=username.data).first()
        if existing_user_username:
            raise ValidationError(
                'That username already exists. Please choose a different one.')


class LoginForm(FlaskForm):
    username = StringField(validators=[
                           InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})

    submit = SubmitField('Login')

#-------------------------------------------------------------------------------------------------------------

#-----------------------------------DATA_BASE CHECKING TO SEE IF INFO IS CORRECT------------------------------

@app.route('/login', methods = ['GET','POST'])
def login():
    form = LoginForm()
    # check the database when the submit button is pushed
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        #If the username exists check the hashed password if they both match go to the user profile
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                login_user(user)
                return redirect(url_for('profile'))
    return render_template('login.html',form=form)

@app.route('/profile', methods = ['GET','POST']) # User to be redirected to their profile once they have logged in
@login_required
def profile():
    return render_template('profile.html')

@app.route('/register',methods = ['GET','POST'])
def register():
    form = RegisterForm()

    if form.validate_on_submit():
        hashed_pwd = bcrypt.generate_password_hash(form.password.data)
        new_user = Users(username = form.username.data,password = hashed_pwd)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))

    return render_template('register.html',form=form)

#-------------------------------------------------------------------------------------------------------------
# User must be logged in. to be logged out this redirects the user to the login page if they have logged out
@app.route('/logout', methods = ['GET','POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

if __name__ == '__main__' :
    app.run(debug=True)


