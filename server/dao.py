from flask      import Flask, request, jsonify, current_app
# from flask.json import JSONEncoder
from sqlalchemy import create_engine, text, insert
from datetime import datetime

def get_all():
    query = "SELECT * FROM barwell"
    rows = current_app.database.execute(text(query)).fetchall()
    if rows:
        data = [{
            'time' : row['time'],
            'E_scr_pv' : row['E_scr_pv'],
            'c_temp_pv' : row['c_temp_pv'],
            'k_rpm_pv' : row['k_rpm_pv'],
            'n_temp_pv' : row['n_temp_pv'],
            'scale_pv' : row['scale_pv'],
            's_temp_pv' : row['s_temp_pv']
            } for row in rows]
        return jsonify({
            'data' : data
        })
    else:
        return None
def insert_barwell(time, scr, ctemp, rpm, ntemp, scale, stemp):
    query = """
    INSERT INTO barwell (
        time, 
        E_scr_pv, 
        c_temp_pv, 
        k_rpm_pv, 
        n_temp_pv, 
        scale_pv, 
        s_temp_pv
        ) VALUES (
            :time,
            :E_scr_pv, 
            :c_temp_pv, 
            :k_rpm_pv, 
            :n_temp_pv, 
            :scale_pv, 
            :s_temp_pv
        )
        """
    with current_app.database.connect() as conn:
        conn.execute(text(query), {
            "time"      : time, 
            "E_scr_pv"  : scr, 
            "c_temp_pv" : ctemp, 
            "k_rpm_pv"  : rpm, 
            "n_temp_pv" : ntemp, 
            "scale_pv"  : scale, 
            "s_temp_pv" : stemp
        })
        conn.commit()
def insert_data(time, scr, ctemp, rpm, ntemp, scale, stemp):
    query = """
    INSERT INTO data (
        time, 
        E_scr_pv, 
        c_temp_pv, 
        k_rpm_pv, 
        n_temp_pv, 
        scale_pv, 
        s_temp_pv
        ) VALUES (
            :time,
            :E_scr_pv, 
            :c_temp_pv, 
            :k_rpm_pv, 
            :n_temp_pv, 
            :scale_pv, 
            :s_temp_pv
        )
        """
    with current_app.database.connect() as conn:
        conn.execute(text(query), {
            "time"      : time, 
            "E_scr_pv"  : scr, 
            "c_temp_pv" : ctemp, 
            "k_rpm_pv"  : rpm, 
            "n_temp_pv" : ntemp, 
            "scale_pv"  : scale, 
            "s_temp_pv" : stemp
        })
        conn.commit()