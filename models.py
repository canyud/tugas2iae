from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Agenda(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    tanggal = db.Column(db.String(10), nullable=False)
    jam = db.Column(db.String(5), nullable=False)
    lokasi = db.Column(db.String(100))
    deskripsi = db.Column(db.Text)

    def __repr__(self):
        return f"<Agenda {self.id}: {self.nama}>"