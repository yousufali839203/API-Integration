let authToken;

function authenticateUser() {
    const loginId = document.getElementById("login_id").value;
    const password = document.getElementById("password").value;

    // Make a POST request to authenticate user
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login_id: loginId,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Authentication failed');
        }
        return response.json();
    })
    .then(data => {
        authToken = data.token;
        showCustomerListScreen();
    })
    .catch(error => {
        alert('Authentication failed. Please check your credentials.');
        console.error(error);
    });
}

function showCustomerListScreen() {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("customerListScreen").style.display = "block";
    document.getElementById("addCustomerScreen").style.display = "none";
    loadCustomerList();
}

function loadCustomerList() {
    // Make a GET request to get the customer list
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    })
    .then(response => response.json())
    .then(data => {
        displayCustomerList(data);
    })
    .catch(error => {
        alert('Error loading customer list.');
        console.error(error);
    });
}

function displayCustomerList(customers) {
    const customerTableBody = document.getElementById("customerTableBody");
    customerTableBody.innerHTML = "";

    customers.forEach(customer => {
        const row = customerTableBody.insertRow();
        row.insertCell(0).innerHTML = customer.first_name;
        row.insertCell(1).innerHTML = customer.last_name;
        row.insertCell(2).innerHTML = customer.email;
        row.insertCell(3).innerHTML = customer.phone;
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = function() {
            deleteCustomer(customer.uuid);
        };
        row.insertCell(4).appendChild(deleteButton);
    });
}

function deleteCustomer(uuid) {
    // Make a POST request to delete the customer
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({
            cmd: 'delete',
            uuid: uuid
        })
    })
    .then(response => {
        if (response.ok) {
            loadCustomerList();
        } else {
            alert('Error deleting customer.');
        }
    })
    .catch(error => {
        alert('Error deleting customer.');
        console.error(error);
    });
}

function showAddCustomerScreen() {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("customerListScreen").style.display = "none";
    document.getElementById("addCustomerScreen").style.display = "block";
}

function createNewCustomer() {
    const newFirstName = document.getElementById("new_first_name").value;
    const newLastName = document.getElementById("new_last_name").value;
    const newEmail = document.getElementById("new_email").value;
    const newPhone = document.getElementById("new_phone").value;

    // Make a POST request to create a new customer
    fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({
            cmd: 'create',
            first_name: newFirstName,
            last_name: newLastName,
            email: newEmail,
            phone: newPhone
        })
    })
    .then(response => {
        if (response.status === 201) {
            showCustomerListScreen();
        } else {
            alert('Error creating customer. Please check your input.');
        }
    })
    .catch(error => {
        alert('Error creating customer.');
        console.error(error);
    });
}