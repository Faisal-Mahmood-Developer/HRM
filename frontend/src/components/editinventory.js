import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditInventory = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        date: '',
        employeeId: '',
        name: '',
        systemManufacturer: '',
        systemModel: '',
        monitor: '',
        romRam: '',
        product: '',
        headphone: '',
        keyboardMouse: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/inventory/getInventory/${id}`);
                if (!res.ok) throw new Error("Failed to fetch inventory item.");
                const data = await res.json();
                setFormData({
                    ...data,
                    date: data.date?.slice(0, 10) || ''
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handleCancelEdit = () => {
        navigate('/viewInventory');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/inventory/updateInventory/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to update inventory item");

            setUpdateSuccess(true);
            setTimeout(() => {
                setUpdateSuccess(false);
                navigate("/viewInventory");
            }, 2000);
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    if (loading) return <div className="container mt-5 text-center">Loading...</div>;
    if (error) return <div className="container mt-5 text-danger text-center">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0 text-center">Edit Inventory Item</h5>
                </div>
                <div className="card-body">
                    {updateSuccess && (
                        <div className="alert alert-success text-center">
                            Inventory updated successfully!
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {[
                                { name: 'date', type: 'date', label: 'Date' },
                                { name: 'employeeId', type: 'text', label: 'Employee ID' },
                                { name: 'name', type: 'text', label: 'Name' },
                                { name: 'systemManufacturer', type: 'text', label: 'Manufacturer' },
                                { name: 'systemModel', type: 'text', label: 'System Model' },
                                { name: 'monitor', type: 'text', label: 'Monitor' },
                                { name: 'romRam', type: 'text', label: 'ROM/RAM' },
                                { name: 'product', type: 'text', label: 'Product' },
                                { name: 'headphone', type: 'text', label: 'Headphone' },
                                { name: 'keyboardMouse', type: 'text', label: 'Keyboard / Mouse' }
                            ].map(({ name, type, label }) => (
                                <div className="col-md-4 mb-3" key={name}>
                                    <label className="form-label">{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        className="form-control"
                                        value={formData[name]}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 d-flex justify-content-end gap-3">
                            <button type="submit" className="btn btn-success w-100">Update Inventory</button>
                            <button type="button" className="btn btn-secondary w-100" onClick={handleCancelEdit}>
                                Cancel Edit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditInventory;
