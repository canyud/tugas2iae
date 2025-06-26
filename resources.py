from flask_restful import Resource, request
from models import Agenda, db
from schemas import agenda_schema, agendas_schema
from http import HTTPStatus

class AgendaListResource(Resource):
    def get(self):
        agendas = Agenda.query.order_by(Agenda.tanggal, Agenda.jam).all()
        return agendas_schema.dump(agendas), HTTPStatus.OK

    def post(self):
        data = request.get_json()
        agenda = agenda_schema.load(data)
        db.session.add(agenda)
        db.session.commit()
        return agenda_schema.dump(agenda), HTTPStatus.CREATED

class AgendaResource(Resource):
    def get(self, agenda_id):
        agenda = Agenda.query.get_or_404(agenda_id)
        return agenda_schema.dump(agenda), HTTPStatus.OK

    def put(self, agenda_id):
        agenda = Agenda.query.get_or_404(agenda_id)
        data = request.get_json()
        agenda = agenda_schema.load(data, instance=agenda, partial=True)
        db.session.commit()
        return agenda_schema.dump(agenda), HTTPStatus.OK

    def delete(self, agenda_id):
        agenda = Agenda.query.get_or_404(agenda_id)
        db.session.delete(agenda)
        db.session.commit()
        return '', HTTPStatus.NO_CONTENT