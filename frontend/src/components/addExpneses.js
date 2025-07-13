import React, { useState, useEffect } from "react";

const Addexpense = () => {
    const [formData, setFormData] = useState({
        date: "",
        product: "",
        quantity: "",
        amount: ""
    });

    const [expenses, setExpenses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [alert, setAlert] = useState({ message: "", type: "" });

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    });

    const showAlert = (message, type = "info") => {
        setAlert({ message, type });
        setTimeout(() => setAlert({ message: "", type: "" }), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isEditing
            ? `http://localhost:5000/api/expense/updateExpense/${editingId}`
            : 'http://localhost:5000/api/expense/addExpense';

        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to save expense');

            showAlert(`Expense ${isEditing ? 'updated' : 'added'} successfully!`, "success");
            setFormData({ date: "", product: "", quantity: "", amount: "" });
            setIsEditing(false);
            setEditingId(null);
            fetchExpenses(selectedMonth);
        } catch (error) {
            console.error('Error:', error);
            showAlert("Something went wrong while saving expense", "danger");
        }
    };

    const fetchExpenses = async (month) => {
        try {
            const res = await fetch(`http://localhost:5000/api/expense/viewExpense?month=${month}`);
            if (!res.ok) throw new Error("Failed to fetch expenses");
            const data = await res.json();
            setExpenses(data);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchExpenses(selectedMonth);
    }, [selectedMonth]);

    const handleEditClick = (expense) => {
        setFormData({
            date: expense.date?.slice(0, 10) || "",
            product: expense.product || "",
            quantity: expense.quantity?.toString() || "",
            amount: expense.amount?.toString() || ""
        });
        setIsEditing(true);
        setEditingId(expense._id);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({ date: "", product: "", quantity: "", amount: "" });
        showAlert("Edit cancelled.", "warning");
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        const modal = new window.bootstrap.Modal(document.getElementById("deleteModal"));
        modal.show();
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`http://localhost:5000/api/expense/deleteExpense/${deleteId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete expense");

            showAlert("Expense deleted successfully!", "danger");
            fetchExpenses(selectedMonth);
            setDeleteId(null);

            const modal = window.bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
            modal.hide();
        } catch (err) {
            console.error("Error:", err);
            showAlert("Error deleting expense", "danger");
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div className="container-fluid p-2 mt-4">

            <div className="row">
                {/* Form Section */}
                <div className="col-md-3">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">{isEditing ? "Edit Expense" : "Add Expense"}</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        className="form-control"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Product</label>
                                    <input
                                        type="text"
                                        name="product"
                                        className="form-control"
                                        value={formData.product}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        className="form-control"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Amount</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        className="form-control"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {isEditing && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary w-100 mb-2"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary w-100">
                                    {isEditing ? "Update Expense" : "Add Expense"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="col-md-9 text-center">
                    <div className="d-flex justify-content-end mb-3">
                        <input
                            type="month"
                            className="form-control"
                            style={{ maxWidth: '200px' }}
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                    </div>

                    <div className="card shadow">
                        <div className="card-header">
                            <h5 className="mb-0">View Expenses</h5>
                        </div>
                        {/* Alert Message */}
                        {alert.message && (
                            <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                                {alert.message}
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        )}

                        <div className="card-body">
                            {expenses.length === 0 ? (
                                <p>No expenses found for selected month.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="table-dark text-center">
                                            <tr>
                                                <th>#</th>
                                                <th>Date</th>
                                                <th>Product</th>
                                                <th>Quantity</th>
                                                <th>Amount</th>
                                                <th>Total</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expenses.map((exp, index) => (
                                                <tr key={exp._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{formatDate(exp.date)}</td>
                                                    <td>{exp.product}</td>
                                                    <td>{exp.quantity}</td>
                                                    <td>{exp.amount}</td>
                                                    <td>{(exp.amount * exp.quantity).toFixed(2)}</td>
                                                    <td>
                                                        <i
                                                            className="far fa-edit me-2 text-primary"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleEditClick(exp)}
                                                        ></i>
                                                        <i
                                                            className="far fa-trash-alt text-danger"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleDelete(exp._id)}
                                                        ></i>

                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="fw-bold bg-light">
                                                <td colSpan="5" className="text-end">Total:</td>
                                                <td>
                                                    {expenses.reduce((total, exp) => total + (exp.amount * exp.quantity), 0).toFixed(2)}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this expense?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-danger" onClick={confirmDelete}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Addexpense;
