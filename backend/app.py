import psutil
from flask import Flask, jsonify
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins for development

# Fetch process data
def get_processes():
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'status', 'username']):
        processes.append(proc.info)
    return processes

# Fetch system metrics
def get_system_metrics():
    return {
        "cpu": psutil.cpu_percent(),
        "memory": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage('/').percent,
        "network": psutil.net_io_counters().bytes_sent + psutil.net_io_counters().bytes_recv
    }

# API endpoint for processes
@app.route('/api/processes')
def api_processes():
    return jsonify(get_processes())

# API endpoint for system metrics
@app.route('/api/system')
def api_system():
    return jsonify(get_system_metrics())

# Real-time updates via WebSocket
@socketio.on('connect')
def handle_connect():
    while True:
        socketio.emit('system_update', get_system_metrics())
        socketio.emit('process_update', get_processes())
        socketio.sleep(1)  # Update interval (1 second)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)