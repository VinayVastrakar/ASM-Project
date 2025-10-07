import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { dashboardApi, DashboardStats } from "../../api/dashboard.api";
import { Alert } from "../common/Alert";

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);
        const response = await dashboardApi.getStats();
        setStats(response.data.data);
        setSuccess('Dashboard data loaded successfully');
        setTimeout(() => setSuccess(null), 2000);
      } catch (err: any) {
        const message = err.response?.data?.message || "Failed to fetch dashboard statistics";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleStatClick = (statType: string, count: number) => {
    if (count > 0) {
      // Navigate to appropriate route based on stat type
      switch (statType) {
        case 'totalAssets':
          navigate('/assets');
          break;
        case 'totalUsers':
          navigate('/users');
          break;
        case 'expiringSoon':
          navigate('/assets?filter=expiring-soon');
          break;
        case 'expired':
          navigate('/assets?filter=expired');
          break;
        case 'assigned':
          navigate('/assets?filter=assigned');
          break;
        case 'nonAssigned':
          navigate('/assets?filter=non-assigned');
          break;
        default:
          break;
      }
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    statType: string;
  }> = ({ title, value, statType }) => {
    const isClickable = value > 0;
    
    return (
      <div
        className={`bg-white p-6 rounded-lg shadow-md ${
          isClickable
            ? 'cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200'
            : 'cursor-default'
        }`}
        onClick={() => handleStatClick(statType, value)}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h2>
        <p className={`text-3xl font-bold ${isClickable ? 'text-primary' : 'text-gray-400'}`}>
          {value}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} />
        </div>
      )}
      {success && (
        <div className="mb-6">
          <Alert type="success" message={success} />
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Assets"
            value={stats.totalAssets}
            statType="totalAssets"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            statType="totalUsers"
          />
          {user?.role === "ADMIN" && (
            <>
              <StatCard
                title="Expiring Soon Assets"
                value={stats.expiringSoonCount}
                statType="expiringSoon"
              />
              <StatCard
                title="Expired Assets"
                value={stats.expiredAssets}
                statType="expired"
              />
              <StatCard
                title="Assigned Assets"
                value={stats.assignedAssets}
                statType="assigned"
              />
              <StatCard
                title="Non Assigned Assets"
                value={stats.nonAssignedAssets}
                statType="nonAssigned"
              />
            </>
          )}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Assets by Category
            </h2>
            <ul className="space-y-3">
              {stats.categoryWise.map((cat) => (
                <li
                  key={cat.category}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <span className="text-gray-700">{cat.category}</span>
                  <span className="font-medium text-primary">{cat.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;