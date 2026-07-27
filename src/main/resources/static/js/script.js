const API_URL = '/api/employees';

// DOM references
const employeeForm = document.getElementById('employeeForm');
const employeeIdField = document.getElementById('employeeId');
const firstNameField = document.getElementById('firstName');
const lastNameField = document.getElementById('lastName');
const emailField = document.getElementById('email');
const departmentField = document.getElementById('department');
const salaryField = document.getElementById('salary');

const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const refreshBtn = document.getElementById('refreshBtn');
const employeeTableBody = document.getElementById('employeeTableBody');
const emptyState = document.getElementById('emptyState');
const alertBox = document.getElementById('alertBox');

const confirmModal = document.getElementById('confirmModal');
const deleteEmployeeName = document.getElementById('deleteEmployeeName');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

let editingId = null;
let pendingDeleteId = null;

// ---------- Utility functions ----------

function showAlert(message, type = 'success') {
  alertBox.textContent = message;
  alertBox.className = `alert ${type}`;
  alertBox.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => alertBox.classList.add('hidden'), 4000);
}

function formatCurrency(value) {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function resetForm() {
  employeeForm.reset();
  employeeIdField.value = '';
  editingId = null;
  formTitle.textContent = 'Add New Employee';
  submitBtn.textContent = 'Add Employee';
  cancelBtn.classList.add('hidden');
}

// ---------- API calls ----------

async function fetchEmployees() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to load employees');
    const employees = await response.json();
    renderEmployees(employees);
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

async function saveEmployee(employee) {
  const isEdit = Boolean(editingId);
  const url = isEdit ? `${API_URL}/${editingId}` : API_URL;
  const method = isEdit ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee)
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data && (data.message || buildValidationMessage(data.errors)) || 'Something went wrong';
    throw new Error(message);
  }

  return data;
}

function buildValidationMessage(errors) {
  if (!errors) return null;
  return Object.values(errors).join(', ');
}

async function deleteEmployeeById(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok && response.status !== 204) {
    const data = await response.json().catch(() => null);
    throw new Error((data && data.message) || 'Failed to delete employee');
  }
}

// ---------- Rendering ----------

function renderEmployees(employees) {
  employeeTableBody.innerHTML = '';

  if (!employees || employees.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  employees.forEach((emp) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${emp.id}</td>
      <td>${escapeHtml(emp.firstName)}</td>
      <td>${escapeHtml(emp.lastName)}</td>
      <td>${escapeHtml(emp.email)}</td>
      <td>${escapeHtml(emp.department)}</td>
      <td>${formatCurrency(emp.salary)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-outline btn-small" data-action="edit" data-id="${emp.id}">Edit</button>
          <button class="btn btn-danger btn-small" data-action="delete" data-id="${emp.id}" data-name="${escapeHtml(emp.firstName)} ${escapeHtml(emp.lastName)}">Delete</button>
        </div>
      </td>
    `;
    employeeTableBody.appendChild(row);
  });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Event handlers ----------

employeeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const employee = {
    firstName: firstNameField.value.trim(),
    lastName: lastNameField.value.trim(),
    email: emailField.value.trim(),
    department: departmentField.value.trim(),
    salary: parseFloat(salaryField.value)
  };

  submitBtn.disabled = true;

  try {
    await saveEmployee(employee);
    showAlert(editingId ? 'Employee updated successfully.' : 'Employee added successfully.', 'success');
    resetForm();
    fetchEmployees();
  } catch (err) {
    showAlert(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
  }
});

cancelBtn.addEventListener('click', resetForm);
refreshBtn.addEventListener('click', fetchEmployees);

employeeTableBody.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === 'edit') {
    editEmployee(id);
  } else if (action === 'delete') {
    openDeleteModal(id, btn.dataset.name);
  }
});

async function editEmployee(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to load employee details');
    const emp = await response.json();

    employeeIdField.value = emp.id;
    firstNameField.value = emp.firstName;
    lastNameField.value = emp.lastName;
    emailField.value = emp.email;
    departmentField.value = emp.department;
    salaryField.value = emp.salary;

    editingId = emp.id;
    formTitle.textContent = `Edit Employee #${emp.id}`;
    submitBtn.textContent = 'Update Employee';
    cancelBtn.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    showAlert(err.message, 'error');
  }
}

function openDeleteModal(id, name) {
  pendingDeleteId = id;
  deleteEmployeeName.textContent = name;
  confirmModal.classList.remove('hidden');
}

function closeDeleteModal() {
  pendingDeleteId = null;
  confirmModal.classList.add('hidden');
}

cancelDeleteBtn.addEventListener('click', closeDeleteModal);

confirmDeleteBtn.addEventListener('click', async () => {
  if (!pendingDeleteId) return;

  try {
    await deleteEmployeeById(pendingDeleteId);
    showAlert('Employee deleted successfully.', 'success');
    if (editingId === pendingDeleteId) resetForm();
    fetchEmployees();
  } catch (err) {
    showAlert(err.message, 'error');
  } finally {
    closeDeleteModal();
  }
});

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', fetchEmployees);
