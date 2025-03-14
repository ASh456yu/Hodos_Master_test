import React from 'react';
import {
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase
} from 'lucide-react';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import "../styles/ClaimApproval.css";
import { handleError } from '../components/utils';

interface TripData {
  _id: string;
  user: string;
  employees_ids: string[] | null;
  workflow: {
    id: string,
    currentNode: string,
    currentApprover: string,
    currentAction: number,
    approvalHistory: {
      nodeId: string,
      approverId: string,
      action: number,
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
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPendingInvoices = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
        handleError(`HTTP error! status: ${response.status}`);
      }

      fetchPendingInvoices();
    } catch (error) {
      console.error('Error processing approval:', error);
      setError(error instanceof Error ? error.message : 'Failed to process approval');
    }
  };

  useEffect(() => {
    fetchPendingInvoices();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="claim-container">
      <div className="claim-header">
        <h1 className="claim-title">Claims Approval</h1>
        <p className="claim-subtitle">Review and process expense claims</p>
      </div>
      
      {error && <div className="claim-error">{error}</div>}
      
      {loading ? (
        <div className="claim-loading">Loading claims data...</div>
      ) : pendingInvoices.length === 0 ? (
        <div className="claim-empty-state">
          <FileText size={48} />
          <p>No pending claims require your approval at this time</p>
        </div>
      ) : (
        <div className="claim-table-container">
          <table className="claim-table">
            <thead>
              <tr>
                <th className="claim-table-header">Trip Details</th>
                <th className="claim-table-header">Amount</th>
                <th className="claim-table-header">Date Range</th>
                <th className="claim-table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingInvoices.map((claim) => (
                <tr key={claim._id} className="claim-table-row">
                  <td className="claim-details-cell">
                    <div className="claim-trip-details">
                      <div className="claim-company">
                        <Briefcase size={16} className="claim-icon" />
                        <span>{claim.trip_id.company}</span>
                      </div>
                      <div className="claim-destination">
                        <MapPin size={16} className="claim-icon" />
                        <span>{claim.trip_id.destination}</span>
                      </div>
                      <div className="claim-purpose">
                        <FileText size={16} className="claim-icon" />
                        <span>{claim.trip_id.purpose}</span>
                      </div>
                    </div>
                  </td>
                  <td className="claim-amount-cell">
                    <div className="claim-amount">
                      <DollarSign size={16} className="claim-icon" />
                      <span>{claim.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </td>
                  <td className="claim-date-cell">
                    <div className="claim-dates">
                      <Calendar size={16} className="claim-icon" />
                      <div className="claim-date-range">
                        <span>{formatDate(claim.trip_id.start_date)}</span>
                        <span className="claim-date-separator">to</span>
                        <span>{formatDate(claim.trip_id.end_date)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="claim-action-cell">
                    {claim.trip_id.workflow.currentApprover && claim.trip_id.workflow.currentApprover === user._id ? (
                      <div className="claim-actions">
                        <button
                          className="claim-button claim-approve-button"
                          onClick={() => handleApproval(claim._id, true)}
                        >
                          <CheckCircle size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          className="claim-button claim-reject-button"
                          onClick={() => handleApproval(claim._id, false)}
                        >
                          <XCircle size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div className="claim-status-approved">
                        <CheckCircle size={16} className="claim-icon" />
                        <span>Approved</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClaimsApprovalPage;