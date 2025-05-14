let transactions = JSON.parse(localStorage.getItem("balanceboard")) || [];

const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");
const filterType = document.getElementById("filter-type");
const exportBtn = document.getElementById("export-btn");

form.addEventListener("submit", addTransaction);
filterType.addEventListener("change", renderList);
exportBtn.addEventListener("click", exportData);

function addTransaction(e) {
    e.preventDefault(); // Prevent form submission

    const name = document.getElementById("name").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const date = document.getElementById("date").value;
    const dueDate = document.getElementById("dueDate").value;
    const notes = document.getElementById("notes").value;

    const transaction = {
        id: Date.now(), // Unique ID for each transaction
        name,
        amount,
        type,
        date,
        dueDate,
        notes, 
    };

    transactions.push(transaction); //to add the new transaction to the array -local storage
    localStorage.setItem("balanceboard", JSON.stringify(transactions)); //to save the array in local storage
    form.reset(); // Reset the form fields
    renderList(); // Re-render the list to show the new transaction
}


function renderList(){
    const filter = filterType.value;
    const now = new Date();
    list.innerHTML = "";

    const filtered = transactions.filter(i => filter === "all" || i.type === filter);

    if (filtered.length === 0) {
        list.innerHTML = "<p>No transactions found.</p>";
        return;
    }

    filtered.forEach(i => {
        const due = new Date(i.dueDate);
        let status = "green";

        if (due < now) status = "red";
        else if ((due - now) / (1000*60*60*24) <= 3) status = "yellow";

        const card = document.createElement("div");
        card.className = `transaction-card ${status}`;
        card.innerHTML = `
            <strong>${i.name}</strong> (${i.type})
            <p>₹${i.amount} | Due: ${i.dueDate}</p>
            <small>${i.notes || ""}</small><br>
            <button onclick = "deleteTransaction(${i.id})">Delete</button>
        `;

        list.appendChild(card);
    });
}


function deleteTransaction(id) {
    transactions = transactions.filter(i => i.id !== id);
    localStorage.setIteam("balanceboard", JSON.stringify(transactions)); //to save the array in local storage
    renderList(); // Re-render the list to show the updated transactions
}

function exportData() {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: "appliaction/json"});
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "BalancedBoard-data.json";
    link.click();

    URL.revokeObjectURL(url);
    alert("Data exported successfully!");
}

renderList();