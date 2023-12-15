import os
from flask import Flask
from flask_cors import CORS
from . import api

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app=app, supports_credentials=True)
    
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=None
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    
    # register api blueprint
    app.register_blueprint(api.bp)
    app.add_url_rule('/', endpoint='gec')

    return app