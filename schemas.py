from flask_marshmallow import Marshmallow
from marshmallow import validate
from models import Agenda  # Import model Agenda yang sebenarnya

ma = Marshmallow()

class AgendaSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Agenda  # Ganti string dengan class model
        load_instance = True

    nama = ma.auto_field(required=True, validate=validate.Length(min=1, max=100))
    tanggal = ma.auto_field(required=True)
    jam = ma.auto_field(required=True)
    lokasi = ma.auto_field()
    deskripsi = ma.auto_field()

agenda_schema = AgendaSchema()
agendas_schema = AgendaSchema(many=True)