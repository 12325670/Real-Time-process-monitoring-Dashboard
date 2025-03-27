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
