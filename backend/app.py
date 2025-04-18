import os
from flask import Flask, jsonify, send_file
import psutil
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend/static', static_url_path='/static')
CORS(app)

@app.route('/stats', methods=['GET'])
def get_stats():
    """Fetches CPU usage, memory usage, and running processes"""
    stats = {
        "cpu_usage": psutil.cpu_percent(interval=1),
        "memory_usage": psutil.virtual_memory().percent,
        "running_processes": len(psutil.pids())
    }
    return jsonify(stats)

@app.route('/')
def serve_frontend():
    """Serves the frontend HTML"""
    # index_path = os.path.abspath('../frontend/static/index.html')
    return send_file(os.path.abspath('../frontend/static/index.html'))

@app.route('/processes', methods=['GET'])
def get_processes():
    """Fetches a list of running processes"""
    process_list = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
        try:
            process_list.append({
                "pid": proc.info['pid'],
                "name": proc.info['name'],
                "cpu": proc.info['cpu_percent'],
                "memory": proc.info['memory_percent']
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue
    return jsonify(process_list)

@app.route('/kill/<int:pid>', methods=['POST'])
def kill_process(pid):
    """Kills a process by its PID"""
    try:
        process = psutil.Process(pid)
        process.terminate()
        return jsonify({"message": f"Process {pid} terminated."})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)


    
