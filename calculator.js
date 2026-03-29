// Carbon Footprint Calculator
// Emission factors based on IPCC AR6, DEFRA 2024, and Our World in Data

document.getElementById('calc-form').addEventListener('submit', function(e) {
    e.preventDefault();
    calculate();
});

function calculate() {
    // === Get input values ===
    const carKm = parseFloat(document.getElementById('car-km').value) || 0;
    const carType = document.getElementById('car-type').value;
    const flights = parseFloat(document.getElementById('flights').value) || 0;
    const diet = document.getElementById('diet').value;
    const beefFreq = parseFloat(document.getElementById('beef-freq').value) || 0;
    const houseSize = document.getElementById('house-size').value;
    const energySource = document.getElementById('energy-source').value;
    const householdSize = parseFloat(document.getElementById('household-size').value) || 1;
    const clothes = parseFloat(document.getElementById('clothes').value) || 0;
    const electronics = parseFloat(document.getElementById('electronics').value) || 0;

    // === TRANSPORT ===
    // kg CO₂ per km by car type (IPCC/DEFRA factors)
    const carEmissionFactors = {
        'gasoline': 0.192,   // kg CO₂/km
        'diesel': 0.171,
        'hybrid': 0.110,
        'electric': 0.053,   // depends on grid, this is global average
        'none': 0
    };

    const carEmissions = carKm * 52 * (carEmissionFactors[carType] || 0) / 1000; // tonnes/year

    // Average long-haul return flight: 1.6 tonnes, short-haul: 0.3 tonnes
    // We estimate a mix: 1.0 tonnes per return flight on average
    const flightEmissions = flights * 1.0; // tonnes/year

    const transportTotal = carEmissions + flightEmissions;

    // === FOOD ===
    // Annual tonnes CO₂e by diet type (Poore & Nemecek 2018 via Our World in Data)
    const dietEmissions = {
        'high-meat': 3.3,
        'medium-meat': 2.5,
        'low-meat': 1.9,
        'vegetarian': 1.5,
        'vegan': 1.1
    };

    // Additional beef impact: each extra beef meal/week ≈ +0.3 tonnes/year
    // We adjust based on how much beef exceeds the diet baseline
    const baseBeefByDiet = {
        'high-meat': 7,
        'medium-meat': 3,
        'low-meat': 1,
        'vegetarian': 0,
        'vegan': 0
    };
    const beefAdjustment = (beefFreq - (baseBeefByDiet[diet] || 0)) * 0.1;

    const foodTotal = (dietEmissions[diet] || 2.5) + beefAdjustment;

    // === HOUSING ===
    // Annual tonnes CO₂e per person (IEA, adjusted for household size)
    const houseEmissions = {
        'small': 1.0,
        'medium': 1.8,
        'large': 2.8
    };

    const energyMultiplier = {
        'natural-gas': 1.0,
        'electricity': 0.85,
        'oil': 1.3,
        'renewable': 0.2
    };

    const housingTotal = (houseEmissions[houseSize] || 1.8) * (energyMultiplier[energySource] || 1.0);

    // === CONSUMPTION ===
    // Clothing: ~25 kg CO₂e per item (average, WRAP data)
    const clothingEmissions = clothes * 0.025; // tonnes/year
    // Electronics: ~300 kg CO₂e per device (lifecycle, average)
    const electronicsEmissions = electronics * 0.3; // tonnes/year

    const consumptionTotal = clothingEmissions + electronicsEmissions;

    // === TOTAL ===
    const total = transportTotal + foodTotal + housingTotal + consumptionTotal;

    // === Display Results ===
    document.getElementById('total-number').textContent = total.toFixed(1);
    document.getElementById('breakdown-transport').textContent = transportTotal.toFixed(1) + ' t';
    document.getElementById('breakdown-food').textContent = foodTotal.toFixed(1) + ' t';
    document.getElementById('breakdown-housing').textContent = housingTotal.toFixed(1) + ' t';
    document.getElementById('breakdown-consumption').textContent = consumptionTotal.toFixed(1) + ' t';

    // Comparison text
    const worldAvg = 4.5;
    const comparison = document.getElementById('comparison-text');
    if (total < worldAvg) {
        const pct = Math.round((1 - total / worldAvg) * 100);
        comparison.textContent = `${pct}% below the global average of ${worldAvg} tonnes`;
    } else {
        const pct = Math.round((total / worldAvg - 1) * 100);
        comparison.textContent = `${pct}% above the global average of ${worldAvg} tonnes`;
    }

    // Show results
    document.getElementById('results').classList.add('show');

    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}
