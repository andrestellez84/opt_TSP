const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');

let cities = [];
let mode = 'add'; // 'add', 'remove'

function drawCity(city) {
    ctx.beginPath();
    ctx.arc(city.x, city.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const city of cities) {
        drawCity(city);
    }
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'add') {
        const city = { x, y };
        cities.push(city);
        drawCity(city);
    } else if (mode === 'remove') {
        // remove city close to click
        for (let i = 0; i < cities.length; i++) {
            const c = cities[i];
            const dx = c.x - x;
            const dy = c.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 6) {
                cities.splice(i, 1);
                break;
            }
        }
        redraw();
    }
});

function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function solveTSPNearestNeighbor(points) {
    if (points.length === 0) return [];
    const unvisited = points.slice();
    const route = [unvisited.shift()];
    while (unvisited.length > 0) {
        const last = route[route.length - 1];
        let bestIndex = 0;
        let bestDist = distance(last, unvisited[0]);
        for (let i = 1; i < unvisited.length; i++) {
            const d = distance(last, unvisited[i]);
            if (d < bestDist) {
                bestDist = d;
                bestIndex = i;
            }
        }
        route.push(unvisited.splice(bestIndex, 1)[0]);
    }
    return route;
}

function drawRoute(route) {
    ctx.beginPath();
    ctx.moveTo(route[0].x, route[0].y);
    for (let i = 1; i < route.length; i++) {
        ctx.lineTo(route[i].x, route[i].y);
    }
    ctx.lineTo(route[0].x, route[0].y); // return to start
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function calculateTotalDistance(route) {
    let total = 0;
    for (let i = 0; i < route.length; i++) {
        const a = route[i];
        const b = route[(i + 1) % route.length];
        total += distance(a, b);
    }
    return total;
}

document.getElementById('add-city').addEventListener('click', () => {
    mode = 'add';
    message.textContent = 'Haz clic en "Agregar Ciudad" y luego en el plano para empezar.';
});

document.getElementById('remove-city').addEventListener('click', () => {
    mode = 'remove';
    message.textContent = 'Haz clic sobre una ciudad para eliminarla.';
});

document.getElementById('solve-tsp').addEventListener('click', () => {
    if (cities.length < 2) {
        message.textContent = 'Agrega al menos dos ciudades.';
        return;
    }
    mode = 'idle';
    redraw();
    const route = solveTSPNearestNeighbor(cities);
    drawRoute(route);
    const dist = calculateTotalDistance(route).toFixed(2);
    message.textContent = `Distancia total: ${dist}`;
});

document.getElementById('clear-all').addEventListener('click', () => {
    cities = [];
    mode = 'add';
    message.textContent = '';
    redraw();
});

message.textContent = 'Haz clic en "Agregar Ciudad" y luego en el plano para empezar.';
