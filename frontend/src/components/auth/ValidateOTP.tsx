import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { passwordApi } from '../../api/password.api';

const ValidateOTP: React.FC = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Get email from navigation state
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            // If no email, redirect back to forgot password
            navigate('/forgot-password');
        }
    }, [location, navigate]);

    useEffect(() => {
        // Countdown timer for resend OTP
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setError('Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await passwordApi.validateOTP({ email, otp });

            // Check if OTP is valid
            if (response.data.isValid) {
                setMessage(response.data.message);

                // Navigate to reset password page
                setTimeout(() => {
                    navigate('/reset-password', { state: { email, otp } });
                }, 1000);
            } else {
                setError(response.data.error || 'Invalid OTP');
            }
        } catch (err: any) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Failed to validate OTP'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await passwordApi.resendOTP(email);
            setMessage(response.data.message);
            setTimer(60); // Reset timer
            setCanResend(false);
        } catch (err: any) {
            if (err.response?.status === 429) {
                setError('Too many requests. Please wait before requesting another OTP.');
            } else {
                setError(
                    err.response?.data?.error ||
                    'Failed to resend OTP'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verify OTP
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter the 6-digit OTP sent to
                    </p>
                    <p className="text-center text-sm font-medium text-gray-900">
                        {email}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="otp" className="sr-only">
                            OTP
                        </label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            required
                            maxLength={6}
                            pattern="[0-9]{6}"
                            inputMode="numeric"
                            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl tracking-widest font-semibold"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setOtp(value.slice(0, 6));
                            }}
                            disabled={loading}
                        />
                    </div>

                    {message && (
                        <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={!canResend || loading}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                {canResend
                                    ? 'Resend OTP'
                                    : `Resend OTP in ${timer}s`
                                }
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ValidateOTP;