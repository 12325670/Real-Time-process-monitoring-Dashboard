async function fetchStats() {
    try {
        const response = await fetch('http://127.0.0.1:5000/stats');
        const data = await response.json();
        document.getElementById("cpu").innerText = data.cpu_usage;
        document.getElementById("memory").innerText = data.memory_usage;
        document.getElementById("processes").innerText = data.running_processes;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

setInterval(fetchStats, 2000);  // Update stats every 2 seconds
fetchStats();
const cpuData = [];
const memoryData = [];
const labels = [];

const ctxCpu = document.getElementById('cpuChart').getContext('2d');
const ctxMemory = document.getElementById('memoryChart').getContext('2d');

const cpuChart = new Chart(ctxCpu, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'CPU Usage (%)',
            data: cpuData,
            borderColor: 'blue',
            borderWidth: 1,
            fill: false
        }]
    }
});

const memoryChart = new Chart(ctxMemory, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Memory Usage (%)',
            data: memoryData,
            borderColor: 'red',
            borderWidth: 1,
            fill: false
        }]
    }
});

async function fetchStats() {
    try {
        const response = await fetch('http://127.0.0.1:5000/stats');
        const data = await response.json();

        document.getElementById("cpu").innerText = data.cpu_usage;
        document.getElementById("memory").innerText = data.memory_usage;
        document.getElementById("processes").innerText = data.running_processes;

        // Update Charts
        if (labels.length > 10) {
            labels.shift();
            cpuData.shift();
            memoryData.shift();
        }
        labels.push(new Date().toLocaleTimeString());
        cpuData.push(data.cpu_usage);
        memoryData.push(data.memory_usage);
        
        cpuChart.update();
        memoryChart.update();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Fetch every 2 seconds
setInterval(fetchStats, 2000);
fetchStats();
