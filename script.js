let chart;
let calculationData = {};

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(`${tab}-tab`).classList.add('active');
}

function calculate() {
    const ctc = parseFloat(document.getElementById('ctc').value) || 0;
    const taxPercent = parseFloat(document.getElementById('tax').value) || 0;
    const rent = parseFloat(document.getElementById('rent').value) || 0;
    const emi = parseFloat(document.getElementById('emi').value) || 0;
    const expenses = parseFloat(document.getElementById('expenses').value) || 0;
    const investment = parseFloat(document.getElementById('investment').value) || 0;
    const insurance = parseFloat(document.getElementById('insurance').value) || 0;
    const goal = parseFloat(document.getElementById('goal').value) || 0;
    const returnRate = parseFloat(document.getElementById('returnRate').value) || 12;
    const years = parseFloat(document.getElementById('years').value) || 10;

    const grossMonthly = ctc / 12;
    const taxAmount = (ctc * taxPercent / 100) / 12;
    const inhand = grossMonthly - taxAmount;
    const savings = inhand - rent - emi - expenses - investment - insurance;
    const savingsPercent = ((savings / inhand) * 100).toFixed(1);

    calculationData = { ctc, taxPercent, rent, emi, expenses, investment, insurance, grossMonthly, taxAmount, inhand, savings };

    document.getElementById('gross').textContent = `₹${grossMonthly.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `₹${taxAmount.toFixed(2)}`;
    document.getElementById('inhand').textContent = `₹${inhand.toFixed(2)}`;
    document.getElementById('rentAmount').textContent = `₹${rent.toFixed(2)}`;
    document.getElementById('emiAmount').textContent = `₹${emi.toFixed(2)}`;
    document.getElementById('expensesAmount').textContent = `₹${expenses.toFixed(2)}`;
    document.getElementById('savings').textContent = `₹${savings.toFixed(2)}`;
    document.getElementById('savingsPercent').textContent = `${savingsPercent}% of income`;

    if (investment > 0) {
        document.getElementById('investmentRow').style.display = 'table-row';
        document.getElementById('investmentAmount').textContent = `₹${investment.toFixed(2)}`;
    }
    if (insurance > 0) {
        document.getElementById('insuranceRow').style.display = 'table-row';
        document.getElementById('insuranceAmount').textContent = `₹${insurance.toFixed(2)}`;
    }

    // Goal Status
    if (goal > 0) {
        const goalDiff = savings - goal;
        const status = goalDiff >= 0 ? 
            `✅ Goal Achieved! Surplus: ₹${goalDiff.toFixed(2)}` : 
            `⚠️ Short by: ₹${Math.abs(goalDiff).toFixed(2)}`;
        document.getElementById('goalStatus').innerHTML = `<strong>Savings Goal:</strong> ${status}`;
        document.getElementById('goalStatus').style.display = 'block';
    }

    // Investment Projection
    if (investment > 0 && years > 0) {
        const monthlyRate = returnRate / 12 / 100;
        const months = years * 12;
        const futureValue = investment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
        const totalInvested = investment * months;
        const returns = futureValue - totalInvested;
        
        document.getElementById('investmentProjection').innerHTML = `
            <h3>Investment Projection (${years} years)</h3>
            <p>Total Invested: ₹${totalInvested.toLocaleString()}</p>
            <p>Expected Returns: ₹${returns.toFixed(0).toLocaleString()}</p>
            <p><strong>Future Value: ₹${futureValue.toFixed(0).toLocaleString()}</strong></p>
        `;
        document.getElementById('investmentProjection').style.display = 'block';
    }

    document.getElementById('results').classList.add('show');
    updateChart(taxAmount, rent, emi, expenses, investment, insurance, savings);
}

function updateChart(taxAmount, rent, emi, expenses, investment, insurance, savings) {
    if (chart) chart.destroy();

    const labels = ['Tax', 'Rent', 'EMI', 'Expenses'];
    const data = [taxAmount, rent, emi, expenses];
    const colors = ['#e74c3c', '#3498db', '#f39c12', '#1abc9c'];

    if (investment > 0) {
        labels.push('Investment');
        data.push(investment);
        colors.push('#9b59b6');
    }
    if (insurance > 0) {
        labels.push('Insurance');
        data.push(insurance);
        colors.push('#34495e');
    }
    if (savings > 0) {
        labels.push('Savings');
        data.push(savings);
        colors.push('#27ae60');
    }

    const ctx = document.getElementById('pieChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function compareScenarios() {
    const ctc1 = parseFloat(document.getElementById('ctc').value) || 0;
    const tax1 = parseFloat(document.getElementById('tax').value) || 0;
    const rent1 = parseFloat(document.getElementById('rent').value) || 0;
    
    const ctc2 = parseFloat(document.getElementById('ctc2').value) || 0;
    const tax2 = parseFloat(document.getElementById('tax2').value) || 0;
    const rent2 = parseFloat(document.getElementById('rent2').value) || 0;
    
    const emi = parseFloat(document.getElementById('emi').value) || 0;
    const expenses = parseFloat(document.getElementById('expenses').value) || 0;

    const inhand1 = (ctc1 / 12) - ((ctc1 * tax1 / 100) / 12);
    const savings1 = inhand1 - rent1 - emi - expenses;
    
    const inhand2 = (ctc2 / 12) - ((ctc2 * tax2 / 100) / 12);
    const savings2 = inhand2 - rent2 - emi - expenses;
    
    const diff = savings2 - savings1;
    const better = diff > 0 ? 'Scenario 2' : 'Scenario 1';
    
    document.getElementById('comparisonResult').innerHTML = `
        <h3>Comparison Result</h3>
        <table>
            <tr><td></td><td><strong>Scenario 1</strong></td><td><strong>Scenario 2</strong></td></tr>
            <tr><td>In-hand</td><td>₹${inhand1.toFixed(2)}</td><td>₹${inhand2.toFixed(2)}</td></tr>
            <tr><td>Savings</td><td>₹${savings1.toFixed(2)}</td><td>₹${savings2.toFixed(2)}</td></tr>
        </table>
        <p><strong>${better} is better by ₹${Math.abs(diff).toFixed(2)}/month</strong></p>
    `;
    document.getElementById('comparisonResult').style.display = 'block';
    document.getElementById('results').classList.add('show');
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Salary Breakdown Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`CTC: ₹${calculationData.ctc}`, 20, 40);
    doc.text(`In-hand: ₹${calculationData.inhand.toFixed(2)}`, 20, 50);
    doc.text(`Savings: ₹${calculationData.savings.toFixed(2)}`, 20, 60);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 70);
    
    doc.save('salary-breakdown.pdf');
}

function saveData() {
    localStorage.setItem('salaryData', JSON.stringify(calculationData));
    alert('Data saved successfully!');
}

function resetAll() {
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.getElementById('results').classList.remove('show');
    if (chart) chart.destroy();
}
