from flask import Flask, jsonify, send_from_directory
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
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
