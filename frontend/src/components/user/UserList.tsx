// components/UserList.tsx
import React, { useEffect, useState ,useCallback} from 'react';
import { useDispatch } from 'react-redux';
import { activeUser, inactiveUser } from '../../redux/slices/userSlice';
import { Link } from 'react-router-dom';
import Pagination from '../common/Pagination';
import userApi, { User } from '../../api/user.api';

const UserList: React.FC = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // New state for actual search
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userStatusLoading, setUserStatusLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userApi.getUsers({ page: page - 1, limit, search: searchQuery });
      setUsers(response.data.users);
      setTotal(response.data.totalItems);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Changed dependency from searchTerm to searchQuery

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setPage(1); // Reset to first page when searching
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatus = async (id: number, status: string) => {
    const action = status === 'Active' ? inactiveUser : activeUser;
    if (window.confirm(`Are you sure you want to ${status === 'Active' ? 'deactivate' : 'activate'} this user?`)) {
      setUserStatusLoading(true);
      try {
        await dispatch(action(id.toString()) as any);
        fetchUsers();
      } catch (err) {
        console.error('Error updating user status', err);
      } finally {
        setUserStatusLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Link
          to="/users/add"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Add New User
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full md:w-64 px-4 py-2 border rounded"
          placeholder="Search users..."
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark whitespace-nowrap disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/users/edit/${user.id}`} className="text-primary hover:text-primary-dark mr-4">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleStatus(user.id, user.status || 'Inactive')}
                      disabled={userStatusLoading}
                      className={`${
                        user.status === 'Active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      } disabled:opacity-50`}
                    >
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(total / limit)}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};

export default UserList;