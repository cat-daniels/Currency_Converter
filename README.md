# New_Currency_Catherine
 Currency converter using flask

###### Intructions

 Create Virtual Environment in VS Code Terminal
```
python -m venv venv

```
 Pop up on bottom of screen

Click Yes


 Activate Virtual Environment
```
venv\Scripts\activate

```
 If you get an error relating to 'Scripts not allowed on this system', run this command
```
Set-ExecutionPolicy -ExecutionPolicy AllSigned -Scope LocalMachine

```
Install Dependencies

 Mac Command - 
```
pip3 install flask flask_sqlalchemy flask_login flask_bcrypt flask_wtf wtforms 
email_validator

```
Windows Command - 
```
pip install flask flask_sqlalchemy flask_login flask_bcrypt flask_wtf wtforms email_validator

(just copy the entire line it'll be fine)

```
Initialise Database
```
flask db init
```

Set Development Environment for debugging and run
```
$env:FLASK_ENV = "development"
flask run