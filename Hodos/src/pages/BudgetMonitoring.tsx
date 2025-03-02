import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import "../styles/BudgetMonitoring.css";
import { handleError, handleSuccess } from "../components/utils";
import Papa from "papaparse";
import { ToastContainer } from "react-toastify";

interface TripDetail {
    id: string,
    status: string,
    comments: string,
}


interface Dept {
    _id: string,
    department: string,
    budget: string,
    trip: {
        detail: [TripDetail],
        right_claims: string,
        false_claims: string,
    }
}

const BudgetMonitoringPage = () => {
    const [departments, setDepartments] = useState<Dept[]>([])
    const [selectedDepartment, setSelectedDepartment] = useState<Dept>();
    // const { user } = useSelector((state: RootState) => state.auth);

    const fetchUserBudgets = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/budget/fetch`, {
                method: 'GET',
                credentials: 'include',
            });
            const result = await response.json();

            if (result.success) {
                console.log(result.data);

                setDepartments(result.data)
                setSelectedDepartment(result.data[0])
            } else {
                handleError(`Error fetching budgets: ${result.message}`);
            }
        } catch (error) {
            handleError(`Error during fetch: ${error}`);
        }
    };
    useEffect(() => {
        fetchUserBudgets()
    }, []);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (result) => {
                const parsedData = result.data.map((userp: any) => ({
                    department: userp.Department,
                    budget: userp.Budget,
                }));


                try {

                    const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/budget/upload_bulk`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ budgets: parsedData }),
                        credentials: 'include'
                    });

                    const result = await response.json();
                    if (result.success) {
                        handleSuccess("Budget saved successfully:");
                    } else {
                        handleError("Error saving budget:");
                    }
                } catch (error) {
                    handleError("Error during upload:");
                }
            },
            error: (error) => {
                handleError(`Error while parsing ${error}`);
            },
        });
    };



    return (
        <div className="budget-container">
            <div className="budget-header">
                <h1 className="budget-title">Budget Monitoring</h1>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="fileInput"
                />
                <div className="budget-flow-container">
                    <button className="budget-flow-button budget-flow-button-primary" onClick={() => document.getElementById('fileInput')?.click()}>
                        <span className="budget-flow-icon">
                            +
                        </span>
                    </button>

                    <select
                        value={selectedDepartment?.department}
                        onChange={(e) => {
                            const selectedDept = departments?.find((dept) => dept.department === e.target.value);
                            setSelectedDepartment(selectedDept);
                        }}
                        className="budget-select"
                    >
                        {departments!.map((dept) => (
                            <option key={dept._id} value={dept.department}>
                                {dept.department}
                            </option>
                        ))}
                    </select>
                </div>


            </div>

            <div className="budget-metrics-grid">
                <div className="budget-card">
                    <div className="budget-card-header">
                        <h3 className="budget-card-title">Total Budget</h3>
                    </div>
                    <div className="budget-card-content">
                        <div className="budget-value">${selectedDepartment?.budget.toLocaleString()}</div>
                    </div>
                </div>

                <div className="budget-card">
                    <div className="budget-card-header">
                        <h3 className="budget-card-title">Total Spent</h3>
                    </div>
                    

                    <div className="budget-card-content">
                        <div className="budget-value">$1000</div>
                        {/* <div className="budget-value">${data.totalSpent.toLocaleString()}</div> */}
                        <p className="budget-subtext">
                            2% of budget
                            {/* {((data.totalSpent / data.totalBudget) * 100).toFixed(1)}% of budget */}
                        </p>
                    </div>
                    <div className="budget-card-header">
                        <h3 className="budget-card-title">Initiated: {selectedDepartment?.trip.detail.length}</h3>
                        <h3 className="budget-card-title">Rejected: {selectedDepartment?.trip.detail.filter(trip => trip.status === "rejected").length}</h3>
                    </div>
                </div>

                <div className="budget-card">
                    <div className="budget-card-header">
                        <h3 className="budget-card-title">Claims Approved</h3>
                    </div>
                    <div className="budget-card-content">
                        <div className="budget-value">$1000</div>
                        <div className="budget-card-title">Right Claim: {selectedDepartment?.trip.right_claims}</div>
                        {/* <div className="budget-value">${data.claimsApproved.toLocaleString()}</div> */}
                        <p className="budget-subtext">
                            2% approval rate
                            {/* {((data.claimsApproved / (data.claimsApproved + data.claimsDenied)) * 100).toFixed(1)}% approval rate */}
                        </p>
                    </div>
                </div>

                <div className="budget-card">
                    <div className="budget-card-header">
                        <h3 className="budget-card-title">Claims Denied</h3>
                    </div>
                    <div className="budget-card-content">
                        <div className="budget-value">$1000</div>
                        {/* <div className="budget-value">${data.claimsDenied.toLocaleString()}</div> */}
                        <div className="budget-card-title">False Claim: {selectedDepartment?.trip.false_claims}</div>
                        <p className="budget-subtext">
                            2% denial rate
                            {/* {((data.claimsDenied / (data.claimsApproved + data.claimsDenied)) * 100).toFixed(1)}% denial rate */}
                        </p>
                    </div>
                </div>
            </div>

            <div className="budget-charts-grid">
                <div className="budget-card">
                    <div className="budget-card-header">
                        <h3 className="budget-card-title">Monthly Spending</h3>
                    </div>
                    <div className="budget-card-content">
                        <div className="budget-chart">
                            {/* <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={data.monthlySpending}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="amount" fill="#0088FE" name="Amount" />
                                </BarChart>
                            </ResponsiveContainer> */}
                        </div>
                    </div>
                </div>

                <div className="budget-card">
                    <div className="budget-card-header">
                        <h3 className="budget-card-title">Top Expense Categories</h3>
                    </div>
                    <div className="budget-card-content">
                        <div className="budget-chart">
                            {/* <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={data.topExpenseCategories}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {data.topExpenseCategories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer> */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="budget-metrics-grid">
                <div className="budget-card">
                    <div className="budget-card-header">
                        <h3 className="budget-card-title">Average Claim Amount</h3>
                    </div>
                    <div className="budget-card-content">
                        <div className="budget-value">$1000</div>
                        {/* <div className="budget-value">${data.averageClaimAmount.toLocaleString()}</div> */}
                    </div>
                </div>

                <div className="budget-card">
                    <div className="budget-card-header">
                        <h3 className="budget-card-title">Compliance Rate</h3>
                    </div>
                    <div className="budget-card-content">
                        <div className="budget-value">2%</div>
                        {/* <div className="budget-value">{data.complianceRate}%</div> */}
                        <p className="budget-subtext budget-trend-up">
                            <ArrowUp size={16} /> 2% from last month
                        </p>
                    </div>
                </div>

                <div className="budget-card">
                    <div className="budget-card-header">
                        <h3 className="budget-card-title">Fraud Detection Rate</h3>
                    </div>
                    <div className="budget-card-content">
                        <div className="budget-value">2%</div>
                        {/* <div className="budget-value">{data.fraudDetectionRate}%</div> */}
                        <p className="budget-subtext budget-trend-down">
                            <ArrowDown size={16} /> 0.5% from last month
                        </p>
                    </div>
                </div>

                <div className="budget-card">
                    <div className="budget-card-header">
                        <h3 className="budget-card-title">Remaining Budget</h3>
                    </div>
                    <div className="budget-card-content">
                        <div className="budget-value">$1000</div>
                        {/* <div className="budget-value">${(data.totalBudget - data.totalSpent).toLocaleString()}</div> */}
                        <p className="budget-subtext">
                            60% remaining
                            {/* {((1 - data.totalSpent / data.totalBudget) * 100).toFixed(1)}% remaining */}
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BudgetMonitoringPage;