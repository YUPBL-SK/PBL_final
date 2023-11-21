from flask import Flask, render_template, request, jsonify, make_response
import tensorflow as tf
import pandas as pd
import numpy as np
import joblib
from flask_cors import CORS
from dao import insert_data, insert_barwell
from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL
from datetime import datetime

app = Flask(__name__)
cors = CORS(app, resources={r"/predict": {"origins": "*"},
                            r"/csv": {"origins": "*"},
                            })
app.config.from_pyfile("config.py")
database = create_engine(app.config['DB_URL'])
app.database = database

loaded_rf = joblib.load("server/1842_RF1000_142dd2.joblib")
loaded_rpm_rf = joblib.load("server/RPM297303_RF1000.joblib")

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/csv', methods=['POST'])
def csvvvv():
    req = request.get_json()
    data = req['data']
    f_out=open('./abcde.csv','w')
    for line in data:
        f_out.write(line)
    f_out.close()
    

@app.route('/predict', methods=['POST'])
def predict():
    req = request.get_json()
    scr = req['E_scr_pv']
    c_temp = req['c_temp_pv']
    rpm = req['k_rpm_pv']
    n_temp = req['n_temp_pv']
    s_temp = req['s_temp_pv']
    
    ac2 = False
    ac3 = False
    
    rpm_input_data = np.array([c_temp, n_temp, s_temp, 3.00])
    rpm_input_data2 = np.array([c_temp, n_temp, s_temp, 2.99])
    rpm_input_data3 = np.array([c_temp, n_temp, s_temp, 3.01])
    predicted_w = loaded_rf.predict(np.array([c_temp, rpm, n_temp, s_temp]).reshape(1,-1))
        
    predicted_rpm = round(loaded_rpm_rf.predict(rpm_input_data.reshape(1,-1))[0])
    predicted_rpm2 = round(loaded_rpm_rf.predict(rpm_input_data2.reshape(1,-1))[0])
    predicted_rpm3 = round(loaded_rpm_rf.predict(rpm_input_data3.reshape(1,-1))[0])
            
    w_input_data1 = np.array([c_temp, predicted_rpm, n_temp, s_temp]).reshape(1,-1)
    w_input_data2 = np.array([c_temp, predicted_rpm2, n_temp, s_temp]).reshape(1,-1)
    w_input_data3 = np.array([c_temp, predicted_rpm3, n_temp, s_temp]).reshape(1,-1)

    p_w = loaded_rf.predict(w_input_data1)
    p_w2 = loaded_rf.predict(w_input_data2)
    p_w3 = loaded_rf.predict(w_input_data3)
        
    predicted_weight = [round(predicted_w[0],3), round(p_w[0],3), round(p_w2[0],3), round(p_w3[0],3)]
    index = 0
        
    abs_p0 = round(abs(predicted_weight[0]-3.0)*1000)
    abs_p1 = round(abs(predicted_weight[1]-3.0)*1000)
    abs_p2 = round(abs(predicted_weight[2]-3.0)*1000)
    abs_p3 = round(abs(predicted_weight[3]-3.0)*1000)
    min_abs = min(abs_p0, abs_p1, abs_p2, abs_p3)
    if abs_p0 == min_abs:
        r_rpm = rpm
        index = 0
    elif abs_p1 == min_abs:
        r_rpm = predicted_rpm
        index = 1
    elif abs_p2 == min_abs:
        r_rpm = predicted_rpm2
        index = 2
    elif abs_p3 == min_abs:
        r_rpm = predicted_rpm3
        index = 3
    
    if abs(predicted_weight[0]-3.0) > 0.1:
        ac2 = True
    if abs(predicted_weight[index]-3.0) > 0.1:
        ac3 = True
    
    time = datetime.now()
    #insert_data(time, scr, c_temp, rpm, n_temp, round(predicted_w[0],3), s_temp)
    if index == 0:
        insert_barwell(time, scr, c_temp, rpm, n_temp, round(predicted_w[0],3), s_temp)
        return jsonify({ "predicted_weight" : round(predicted_w[0],3),
                    "recommended_rpm" : -1,
                    "rpm_weight" : -1,
                    "is_error" : ac2,
                    "is_rpm_error" : ac2
                    })
    else:
        insert_barwell(time, scr, c_temp, r_rpm, n_temp, round(predicted_weight[index],3), s_temp)
        return jsonify({ "predicted_weight" : round(predicted_w[0],3),
                    "recommended_rpm" : r_rpm,
                    "rpm_weight" : predicted_weight[index],
                    "is_error" : ac2,
                    "is_rpm_error" : ac3
                    })

if __name__ == "__main__":
    app.run()