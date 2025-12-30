import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AnalyticsService from '../services/analytics.service';
import AuthService from '../services/auth.service';

const Analytics = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setUserRole(user.roles[0]);
            loadData(user.roles[0]);
        }
    }, []);

    const loadData = (role) => {
        setLoading(true);
        if (role === 'ROLE_PATIENT') {
            AnalyticsService.getPatientHistory().then(res => setData(res.data)).finally(() => setLoading(false));
        } else if (role === 'ROLE_PHARMACIST') {
            AnalyticsService.getPharmacistOverview().then(res => setData(res.data)).finally(() => setLoading(false));
        } else if (role === 'ROLE_ADMIN') {
            AnalyticsService.getAdminStats().then(res => setData(res.data)).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="text-2xl mr-4">←</button>
                <h1 className="text-xl font-bold">Analytics</h1>
            </div>

            {/* Tabs (Visual only for now, autoselected by role) */}
            <div className="flex space-x-6 border-b border-zinc-800 mb-8 overflow-x-auto">
                {['Patient', 'Doctor', 'Pharmacy', 'Admin'].map(tab => (
                    <button
                        key={tab}
                        className={`pb-2 text-sm font-medium ${userRole.includes(tab.toUpperCase()) ? 'text-white border-b-2 border-white' : 'text-zinc-500'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? <p className="text-center text-zinc-500">Loading analytics...</p> : (
                <>
                    {/* Patient View */}
                    {userRole === 'ROLE_PATIENT' && data && (
                        <div>
                            <h2 className="text-lg font-bold mb-4">Adherence Trends</h2>
                            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-6 relative overflow-hidden">
                                <div className="mb-4">
                                    <p className="text-zinc-400 text-sm">Medication Adherence</p>
                                    <h3 className="text-4xl font-bold">{data.currentAdherence.toFixed(0)}%</h3>
                                    <p className="text-green-500 text-sm mt-1">Last 30 Days +5%</p>
                                </div>

                                <div className="h-48 w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.trend}>
                                            <defs>
                                                <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                            <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                                            <Area type="monotone" dataKey="adherence" stroke="#82ca9d" fillOpacity={1} fill="url(#colorAdherence)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pharmacist View */}
                    {userRole === 'ROLE_PHARMACIST' && data && (
                        <div>
                            <h2 className="text-lg font-bold mb-4">Stock Overview</h2>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                                    <p className="text-zinc-500 text-xs uppercase">Low Stock Items</p>
                                    <h3 className="text-3xl font-bold text-red-500">{data.lowStockCount}</h3>
                                </div>
                                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                                    <p className="text-zinc-500 text-xs uppercase">Total Value</p>
                                    <h3 className="text-3xl font-bold text-green-500">${data.totalInventoryValue.toLocaleString()}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Admin View */}
                    {userRole === 'ROLE_ADMIN' && data && (
                        <div>
                            <h2 className="text-lg font-bold mb-4">System Stats</h2>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="bg-zinc-900 p-4 rounded-xl">
                                    <p className="text-zinc-500 text-xs">Users</p>
                                    <h3 className="text-2xl font-bold">{data.totalUsers}</h3>
                                </div>
                                <div className="bg-zinc-900 p-4 rounded-xl">
                                    <p className="text-zinc-500 text-xs">Prescriptions</p>
                                    <h3 className="text-2xl font-bold">{data.totalPrescriptions}</h3>
                                </div>
                                <div className="bg-zinc-900 p-4 rounded-xl">
                                    <p className="text-zinc-500 text-xs">Drugs</p>
                                    <h3 className="text-2xl font-bold">{data.totalDrugs}</h3>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800 flex justify-around py-4">
                <div className="flex flex-col items-center text-zinc-500"><span className="text-xl">🏠</span><span className="text-xs">Dashboard</span></div>
                <div className="flex flex-col items-center text-white"><span className="text-xl">📊</span><span className="text-xs">Analytics</span></div>
                <div className="flex flex-col items-center text-zinc-500"><span className="text-xl">👤</span><span className="text-xs">Profile</span></div>
            </div>
        </div>
    );
};

export default Analytics;
