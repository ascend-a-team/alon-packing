from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy import Column, Integer, String
from app import db

engine = create_engine('sqlite:///database.db', echo=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

# Set your classes here.

class User(Base):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(30))
    def __init__(self, name=None, password=None):
        self.name = name
        self.password = password

class Shipment(Base):
    __tablename__ = 'Shipments'
    id = db.Column(db.Integer, primary_key=True)
    amazon_shipment_id = db.Column(db.String(30), unique=True)

class Box(Base):
    __tablename__ = 'Shipments'
    id = db.Column(db.Integer, primary_key=True)
    shipment_id = db.Column(db.Integer, unique=False)
    number = db.Column(db.Integer, unique=False)
    weight = db.Column(db.Integer, unique=False)
    height = db.Column(db.Integer, unique=False)
    width = db.Column(db.Integer, unique=False)
    length = db.Column(db.Integer, unique=False)

class Item(Base):
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(30), unique=True)
    upc = db.Column(db.String(30), unique=True)

# Create tables.
Base.metadata.create_all(bind=engine)
