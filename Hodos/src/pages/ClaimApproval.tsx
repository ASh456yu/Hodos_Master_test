import React from 'react';
import {
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import "../styles/ClaimApproval.css"


interface TripData {
  _id: string;
  user: string;
  employees_ids: string[] | null;
  workflow: {
    id: string,
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
  company: string;
  destination: string;
  purpose: string;
  start_date: string;
  end_date: string;
  estimated_cost: string;
  allowance: number;
  status: string;
}


interface Invoice {
  _id: string;
  trip_id: TripData;
  total: number;
}

interface ApiResponse {
  mydata: Invoice[];
}

const ClaimsApprovalPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [pendingInvoices, setPendingInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string>("");

  const fetchPendingInvoices = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/claim/pending`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setPendingInvoices(data.mydata);
    } catch (error) {
      console.error('Error fetching pending invoices:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch invoices');
    }
  };

  const handleApproval = async (invoiceId: string, approved: boolean) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/claim/approve`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            taskId: invoiceId,
            approved,
            userId: user?._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPendingInvoices((prev) =>
        prev.filter((invoice) => invoice._id !== invoiceId)
      );
    } catch (error) {
      console.error('Error processing approval:', error);
      setError(error instanceof Error ? error.message : 'Failed to process approval');
    }
  };

  useEffect(() => {
    fetchPendingInvoices();
  }, []);

  return (
    <div className="claims-container">
      <h1 className="claims-title">Claims Approval</h1>
      {error && <div className="error-message">{error}</div>}
      <table className="claims-table">
        <thead>
          <tr>
            <th>Trip Details</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingInvoices.map((claim) => (
            <tr key={claim._id}>
              <td>
                <div className="trip-details">
                  <p><strong>Company:</strong> {claim.trip_id.company}</p>
                  <p><strong>Destination:</strong> {claim.trip_id.destination}</p>
                  <p><strong>Purpose:</strong> {claim.trip_id.purpose}</p>
                  {/* <p><strong>Requester:</strong> {claim.workflow.user.name}</p> */}
                </div>
              </td>
              <td>${claim.total}</td>
              <td>
                <div>
                  <p>Start: {claim.trip_id.start_date}</p>
                  <p>End: {claim.trip_id.end_date}</p>
                </div>
              </td>
              {/* <td>{claim.completion}%</td> */}
              <td className="claims-actions">
                <button
                  className="claims-button claims-button-approve"
                  onClick={() => handleApproval(claim._id, true)}
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  className="claims-button claims-button-reject"
                  onClick={() => handleApproval(claim._id, false)}
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimsApprovalPage;