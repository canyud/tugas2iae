from flask import Flask, render_template
from flask_restful import Api
from flask_cors import CORS
from config import Config
from models import db
from schemas import ma
from resources import AgendaListResource, AgendaResource

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config.from_object(Config)

CORS(app)
db.init_app(app)
ma.init_app(app)
api = Api(app)

api.add_resource(AgendaListResource, '/api/agendas')
api.add_resource(AgendaResource, '/api/agendas/<int:agenda_id>')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)