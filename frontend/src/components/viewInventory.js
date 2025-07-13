import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ViewInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    });

    const formatDate = (d) => new Date(d).toLocaleDateString("en-GB");

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/inventory/viewInventory?month=${selectedMonth}`);
            if (!res.ok) throw new Error("Failed to fetch inventory data");
            const data = await res.json();
            setInventory(data);
        } catch (err) {
            console.error(err.message);
            setError("Error loading inventory data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [selectedMonth]);

    const handleDelete = (id) => {
        setDeleteId(id);
        const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`http://localhost:5000/api/inventory/deleteInventory/${deleteId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error("Delete failed");

            setInventory(prev => prev.filter(item => item._id !== deleteId));
            setDeleteId(null);

            const modal = window.bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal.hide();

            setDeleteSuccess(true);
            setTimeout(() => setDeleteSuccess(false), 3000);
        } catch (err) {
            alert('Failed to delete inventory item');
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="text-center mb-4">Inventory Records</h3>

            <div className="d-flex justify-content-end mb-3">
                <input
                    type="month"
                    className="form-control"
                    style={{ maxWidth: '200px' }}
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                />
            </div>

            {deleteSuccess && (
                <div className="alert alert-success text-center">
                    Inventory deleted successfully!
                </div>
            )}

            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-danger text-center">{error}</p>}

            {!loading && !error && (
                <div className="card shadow">
                    <div className="card-body table-responsive">
                        {inventory.length === 0 ? (
                            <p className="text-center">No inventory found for selected month.</p>
                        ) : (
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark text-center">
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Emp ID</th>
                                        <th>Name</th>
                                        <th>Manufacturer</th>
                                        <th>Model</th>
                                        <th>Monitor</th>
                                        <th>ROM/RAM</th>
                                        <th>Product</th>
                                        <th>Headphone</th>
                                        <th>Keyboard/Mouse</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map((item, idx) => (
                                        <tr key={item._id}>
                                            <td>{idx + 1}</td>
                                            <td>{formatDate(item.date)}</td>
                                            <td>{item.employeeId}</td>
                                            <td>{item.name}</td>
                                            <td>{item.systemManufacturer}</td>
                                            <td>{item.systemModel}</td>
                                            <td>{item.monitor}</td>
                                            <td>{item.romRam}</td>
                                            <td>{item.product}</td>
                                            <td>{item.headphone}</td>
                                            <td>{item.keyboardMouse}</td>
                                            <td className="text-center">
                                                <Link to={`/editInventory/${item._id}`}>
                                                    <i className="far fa-edit text-primary me-3" style={{ cursor: 'pointer' }}></i>
                                                </Link>
                                                <i className="far fa-trash-alt text-danger" style={{ cursor: 'pointer' }} onClick={() => handleDelete(item._id)}></i>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this inventory item?
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

export default ViewInventory;
