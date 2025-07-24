import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PayrollDetail = () => {
    // const { id } = useParams(); // MongoDB _id from URL
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [employeeName, setEmployeeName] = useState('');

    useEffect(() => {
        const fetchPayrolls = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const res = await fetch(`http://localhost:5000/api/payroll/by-year?year=${selectedYear}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (Array.isArray(data)) {
                    setPayrolls(data);
                    if (data.length > 0) {
                        setEmployeeName(data[0].name); // get name from first record
                    }
                } else {
                    setPayrolls([]);
                }
            } catch (err) {
                console.error('Failed to fetch payroll data', err);
                setPayrolls([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPayrolls();
    }, [selectedYear]);


    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h3 className="mb-3 text-primary">Payroll Details - {selectedYear}</h3>

                <div className="d-flex justify-content-between align-items-center mb-4">
                    {employeeName && (
                        <h5 className="mb-0">
                            Employee: <span className="text-dark">{employeeName}</span>
                        </h5>
                    )}

                    <div className="d-flex align-items-center">
                        <label className="form-label mb-0 me-2" htmlFor="yearInput">Select Year:</label>
                        <input
                            id="yearInput"
                            type="number"
                            min="2000"
                            max={currentYear}
                            className="form-control"
                            style={{ width: '130px' }}
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        />
                    </div>
                </div>



                {loading ? (
                    <p>Loading...</p>
                ) : payrolls.length === 0 ? (
                    <p>No payroll records found for {selectedYear}.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Month</th>
                                    <th>Basic Salary</th>
                                    <th>Bonus</th>
                                    <th>Medical</th>
                                    <th>Conveyance</th>
                                    <th>Loan</th>
                                    <th>Net Salary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payrolls.map((p, index) => {
                                    const netSalary =
                                        (p.basicSalary || 0) +
                                        (p.bonus || 0) +
                                        (p.medicalAllowance || 0) +
                                        (p.conveyanceAllowance || 0) -
                                        (p.loanDeductions || 0) -
                                        (p.incomeTax || 0);

                                    return (
                                        <tr key={p._id}>
                                            <td>{index + 1}</td>
                                            <td>{p.month}</td>
                                            <td>{p.basicSalary}</td>
                                            <td>{p.bonus}</td>
                                            <td>{p.medicalAllowance}</td>
                                            <td>{p.conveyanceAllowance}</td>
                                            <td>{p.loanDeductions}</td>
                                            <td>{netSalary}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollDetail;
