import { CheckCircle, XCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { handleError, handleSuccess } from '../components/utils';
import '../styles/TravelApproval.css'
import { ToastContainer } from 'react-toastify';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';

interface Travel {
    _id: string,
    employees_ids: [],
    destination: string,
    purpose: string,
    start_date: string,
    end_date: string,
    estimated_cost: string,
    status: string,
    workflow: {
        currentNode: string,
        currentApprover: string,
        approvalHistory: {
            nodeId: string,
            approverId: string,
            approved: boolean,
            comments: string,
            timestamp: string
        }[]
    }
}

interface Employee {
    _id: string;
    email: string;
    name: string;
    position: string;
    employee_id: string;
    company: string;
    password: string;
}


const TravelDetails: React.FC = () => {
    const [trips, setTrips] = useState<Travel[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [budget, setBudget] = useState(45231);
    const [pendingApproval, setPendingApproval] = useState(0);
    const didFetch = useRef(false);
    const { user } = useSelector((state: RootState) => state.auth);


    const fetchTrips = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/travel/fetch`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                handleError(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                setTrips(result.trips);
                
                const approvedCost = result.trips
                    .filter((trip: Travel) => trip.status === "Approved")
                    .reduce((acc: number, trip: Travel) => acc + parseFloat(trip.estimated_cost), 0);


                const pending = result.trips
                    .filter((trip: Travel) => trip.status === "pending_trip_approval").length;
                setPendingApproval(pending);

                setBudget(prevBudget => Math.max(0, prevBudget - approvedCost));

            } else {
                handleError(result.message || "Failed to fetch employees");
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : String(err));
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/info/details`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                handleError(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setEmployees(result.users);

            } else {
                handleError(result.message || "Failed to fetch employees");
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : String(err));
        }
    };

    useEffect(() => {
        if (!didFetch.current) {
            fetchTrips();
            fetchEmployees();
            didFetch.current = true;
        }
    }, []);

    const updateTripStatus = async (tripId: string, status: string) => {
        // const selectedWorkflow = newWorkflows[tripId];
        // if (!selectedWorkflow) {
        //     handleWarn("Please select a workflow!!");
        //     return;
        // }
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/travel/update-status`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tripId, status }),
            });

            const result = await response.json();

            if (result.success) {
                handleSuccess(`Trip ${status} successfully!`);
                fetchTrips();
            } else {
                handleError(result.error || "Failed to update trip status.");
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : String(err));
        }
    };

    return (
        <>

            <div className="trip-container">
                <div className="trip-grid">
                    {/* Summary Cards */}
                    <div className="trip-summary-cards">
                        <div className="trip-card">
                            <div className="trip-card-header">
                                <h3 className="trip-card-title">Pending Approvals</h3>
                            </div>
                            <div className="trip-card-content">
                                <div className="trip-metric">{pendingApproval}</div>
                                <p className="trip-metric-subtitle">+2 since last week</p>
                            </div>
                        </div>

                        <div className="trip-card">
                            <div className="trip-card-header">
                                <h3 className="trip-card-title">Approved This Month</h3>
                            </div>
                            <div className="trip-card-content">
                                <div className="trip-metric">28</div>
                                <p className="trip-metric-subtitle">+8 from last month</p>
                            </div>
                        </div>

                        <div className="trip-card">
                            <div className="trip-card-header">
                                <h3 className="trip-card-title">Total Budget Used</h3>
                            </div>
                            <div className="trip-card-content">
                                <div className="trip-metric">${budget}</div>
                                <p className="trip-metric-subtitle">+12% from last month</p>
                            </div>
                        </div>
                    </div>

                    {/* Trip Requests Table */}
                    <div className="trip-card">
                        <div className="trip-card-header">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h2 className="trip-card-title">Trip Requests</h2>
                                    <p className="trip-card-description">Review and approve employee trip requests</p>
                                </div>
                            </div>
                        </div>
                        <div className="trip-card-content">
                            <table className="trip-table">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Destination</th>
                                        <th>Purpose</th>
                                        <th>Dates</th>
                                        <th>Est. Cost</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trips.map((trip) => (
                                        <tr key={trip._id}>
                                            <td className="trip-font-medium">
                                                {trip.employees_ids.map((empId) => {
                                                    const employee = employees.find(emp => emp._id === empId);
                                                    return employee ? <p key={employee._id}>{employee.name}</p> : <p key={empId}>Unknown</p>;
                                                })}
                                            </td>
                                            <td>{trip.destination}</td>
                                            <td>{trip.purpose}</td>
                                            <td>
                                                {new Date(trip.start_date).toLocaleDateString()} -{" "}
                                                {new Date(trip.end_date).toLocaleDateString()}
                                            </td>
                                            <td>${trip.estimated_cost}</td>
                                            <td>
                                                <span
                                                    className="trip-badge"
                                                    style={{
                                                        backgroundColor:
                                                            trip.status === "Approved"
                                                                ? "lightgreen"
                                                                : trip.status === "pending_trip_approval"
                                                                    ? "yellow"
                                                                    : trip.status === "Rejected"
                                                                        ? "red"
                                                                        : "transparent",
                                                    }}
                                                >
                                                    {
                                                        trip.status === "pending_trip_approval" && trip.workflow.currentApprover == user._id
                                                            ? "Pending"
                                                            : trip.workflow.approvalHistory.some(history => history.approverId === user._id && history.approved == true)
                                                                ? "Approved"
                                                                : trip.workflow.approvalHistory.some(history => history.approverId === user._id && history.approved == false)
                                                                    ? "Rejected"
                                                                    : <></>
                                                    }
                                                </span>

                                            </td>
                                            <td>
                                                <div className="trip-button-group">
                                                    {trip.workflow.currentApprover == user._id && trip.status === "pending_trip_approval" ? (
                                                        <>
                                                            <button
                                                                className="trip-button trip-approve"
                                                                onClick={() => updateTripStatus(trip._id, "Approved")}
                                                            >
                                                                <CheckCircle className="trip-icon" />
                                                            </button>
                                                            <button
                                                                className="trip-button trip-reject"
                                                                onClick={() => updateTripStatus(trip._id, "Rejected")}
                                                            >
                                                                <XCircle className="trip-icon" />
                                                            </button>
                                                        </>
                                                    ) : trip.workflow.approvalHistory.some(history => history.approverId === user._id && history.approved == true)
                                                        ? (
                                                            <CheckCircle className="trip-icon text-green-500" />
                                                        ) : trip.workflow.approvalHistory.some(history => history.approverId === user._id && history.approved == false)? (
                                                            <XCircle className="trip-icon text-red-500" />
                                                        ): <></>}
                                                </div>
                                            </td>


                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>

    );
};

export default TravelDetails;
