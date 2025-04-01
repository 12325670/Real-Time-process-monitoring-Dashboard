async function fetchStats() {
    try {
        const response = await fetch('http://127.0.0.1:5000/stats');
        const data = await response.json();

        document.getElementById("cpu").innerText = data.cpu_usage;
        document.getElementById("memory").innerText = data.memory_usage;
        document.getElementById("processes").innerText = data.running_processes;

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

// setInterval(fetchStats, 2000);  // Update stats every 2 seconds
// fetchStats();

// async function fetchprocesses(){
//     try {
//         const response = await fetch('http://127.0.0.1:5000/stats');
//         const data = await response.json();


// const cpuData = [];
// const memoryData = [];
// const labels = [];

// const ctxCpu = document.getElementById('cpuChart').getContext('2d');
// const ctxMemory = document.getElementById('memoryChart').getContext('2d');

// const cpuChart = new Chart(ctxCpu, {
//     type: 'line',
//     data: {
//         labels: labels,
//         datasets: [{
//             label: 'CPU Usage (%)',
//             data: cpuData,
//             borderColor: 'blue',
//             borderWidth: 1,
//             fill: false
//         }]
//     }
// });

// const memoryChart = new Chart(ctxMemory, {
//     type: 'line',
//     data: {
//         labels: labels,
//         datasets: [{
//             label: 'Memory Usage (%)',
//             data: memoryData,
//             borderColor: 'red',
//             borderWidth: 1,
//             fill: false
//         }]
//     }
// });

// async function fetchStats() {
//     try {
        

//         document.getElementById("cpu").innerText = data.cpu_usage;
//         document.getElementById("memory").innerText = data.memory_usage;
//         document.getElementById("processes").innerText = data.running_processes;

//         // Update Charts
  

// Fetch every 2 seconds
setInterval(fetchStats, 2000);
fetchStats();

async function fetchProcesses() {
    try {
        const response = await fetch('http://127.0.0.1:5000/processes');
        const data = await response.json();
        const table = document.getElementById("processTable");
        table.innerHTML = ""; // Clear previous data

        data.forEach(proc => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${proc.pid}</td>
                <td>${proc.name}</td>
                <td>${proc.cpu}</td>
                <td>${proc.memory}</td>
                <td><button onclick="killProcess(${proc.pid})">Kill</button></td>
            `;
            table.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching processes:", error);
    }
}

// Fetch every 5 seconds
setInterval(fetchProcesses, 5000);
fetchProcesses();

async function killProcess(pid) {
    const response = await fetch(`http://127.0.0.1:5000/kill/${pid}`, { method: "POST" });
    const result = await response.json();
    alert(result.message || result.error);
    fetchProcesses(); // Refresh process list
}

