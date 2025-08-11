import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { purchaseHistoryApi } from '../../api/purchaseHistory.api';
import { assetApi } from '../../api/asset.api';

interface PurchaseHistory {
  id: number;
  assetId: number;
  assetName: string;
  purchaseDate: string;
  amount: number;
  vendor: string;
  notify: string;
  expiryDate: string;
  invoiceNumber: string;
  warrantyPeriod: number;
  description?: string;
  billUrl?: string;
  qty: number;
}

const ViewPurchaseHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const char = searchParams.get('char'); // "A" if passed from button
  const navigate = useNavigate();

  const [historyList, setHistoryList] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        let response: any;

        if (char === 'A') {
          // Returns list
          response = await purchaseHistoryApi.getPurchaseHistoryByAssetId(Number(id));
          setHistoryList(response);
        } else {
          // Returns single item
          response = await purchaseHistoryApi.getPurchaseHistoryById(Number(id));
          setHistoryList([response]); // wrap single object into array
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch purchase history');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, char]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">Error: {error}</div>;
  }

  if (!historyList.length) {
    return <div className="text-gray-600 p-4">Purchase history not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Purchase History Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition"
          >
            Back
          </button>
        </div>

        {/* Scrollable list for multiple purchase histories */}
        <div className="max-h-[500px] overflow-y-auto space-y-6">
          {historyList.map((history) => (
            <div key={history.id} className="border-b pb-4">
              <div>
                <span className="font-medium">Asset:</span> {history.assetName}
              </div>
              <div>
                <span className="font-medium">Purchase Date:</span>{' '}
                {new Date(history.purchaseDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Expiry Date:</span>{' '}
                {new Date(history.expiryDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Amount:</span> ₹{history.amount.toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Vendor:</span> {history.vendor}
              </div>
              <div>
                <span className="font-medium">Invoice Number:</span> {history.invoiceNumber}
              </div>
              <div>
                <span className="font-medium">Warranty Period:</span> {history.warrantyPeriod} months
              </div>
              <div>
                <span className="font-medium">Notify:</span> {history.notify}
              </div>
              <div>
                <span className="font-medium">Description:</span> {history.description || '-'}
              </div>
              <div>
                <span className="font-medium">Qty:</span> {history.qty}
              </div>
              {history.billUrl && (
                <div>
                  <span className="font-medium">Bill PDF:</span>{' '}
                  <a
                    href={history.billUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-2"
                    download
                  >
                    Download PDF
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPurchaseHistory;
