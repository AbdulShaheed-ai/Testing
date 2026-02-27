const HOURLY_RATE = 2.5;
const state = {
  capacity: 20,
  parked: new Map(),
  revenue: 0,
};

const refs = {
  capacity: document.getElementById('capacity'),
  occupied: document.getElementById('occupied'),
  available: document.getElementById('available'),
  revenue: document.getElementById('revenue'),
  status: document.getElementById('status'),
  entryForm: document.getElementById('entry-form'),
  exitForm: document.getElementById('exit-form'),
  entryPlate: document.getElementById('plate'),
  exitPlate: document.getElementById('exit-plate'),
  tableBody: document.getElementById('parking-table-body'),
};

function normalizePlate(value) {
  return value.trim().toUpperCase();
}

function render() {
  const occupied = state.parked.size;
  const available = state.capacity - occupied;

  refs.capacity.textContent = String(state.capacity);
  refs.occupied.textContent = String(occupied);
  refs.available.textContent = String(available);
  refs.revenue.textContent = state.revenue.toFixed(2);

  refs.tableBody.innerHTML = '';
  if (occupied === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="4">No vehicles currently parked.</td>';
    refs.tableBody.appendChild(row);
    return;
  }

  for (const [plate, vehicle] of state.parked.entries()) {
    const row = document.createElement('tr');
    const minutes = Math.floor((Date.now() - vehicle.checkIn) / 60000);
    row.innerHTML = `
      <td>${plate}</td>
      <td>${new Date(vehicle.checkIn).toLocaleString()}</td>
      <td>${minutes} min</td>
      <td>Parked</td>
    `;
    refs.tableBody.appendChild(row);
  }
}

function setStatus(message) {
  refs.status.textContent = message;
}

refs.entryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const plate = normalizePlate(refs.entryPlate.value);

  if (!plate) {
    setStatus('Please provide a valid plate number.');
    return;
  }

  if (state.parked.size >= state.capacity) {
    setStatus(`Parking is full. Vehicle ${plate} cannot enter now.`);
    return;
  }

  if (state.parked.has(plate)) {
    setStatus(`Vehicle ${plate} is already inside.`);
    return;
  }

  state.parked.set(plate, { checkIn: Date.now() });
  refs.entryForm.reset();
  setStatus(`Vehicle ${plate} checked in successfully.`);
  render();
});

refs.exitForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const plate = normalizePlate(refs.exitPlate.value);

  if (!state.parked.has(plate)) {
    setStatus(`Vehicle ${plate || '(blank)'} not found.`);
    return;
  }

  const parkedVehicle = state.parked.get(plate);
  const parkedMs = Date.now() - parkedVehicle.checkIn;
  const parkedHours = Math.max(1, Math.ceil(parkedMs / (1000 * 60 * 60)));
  const fee = parkedHours * HOURLY_RATE;

  state.revenue += fee;
  state.parked.delete(plate);
  refs.exitForm.reset();

  setStatus(`Vehicle ${plate} checked out. Fee: $${fee.toFixed(2)} (${parkedHours}h).`);
  render();
});

render();
setInterval(render, 60 * 1000);
