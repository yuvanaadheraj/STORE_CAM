import React, { useState, useEffect } from 'react';

const DashboardExtensions = () => {
  const [departments, setDepartments] = useState([]);
  const [staffYield, setStaffYield] = useState([]);
  const [loyalty, setLoyalty] = useState({});

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/micro-funnels')
      .then(res => res.json())
      .then(data => setDepartments(data.departments || []))
      .catch(err => console.error("Error fetching departments:", err));

    fetch('http://localhost:8000/api/dashboard/staff-yield')
      .then(res => res.json())
      .then(data => setStaffYield(data.staff || []))
      .catch(err => console.error("Error fetching staff:", err));

    fetch('http://localhost:8000/api/dashboard/loyalty-ratio')
      .then(res => res.json())
      .then(data => setLoyalty(data.ratios || {}))
      .catch(err => console.error("Error fetching loyalty:", err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      
      {/* Department Conversion */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Department Conversion (GMV)</h2>
        <ul className="space-y-3">
          {departments.map((dept, idx) => (
            <li key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="capitalize text-gray-600">{dept.dep_name}</span>
              <span className="font-bold text-emerald-600">₹{dept.GMV.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Staff Yield */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Staff Leaderboard (Yield)</h2>
        <ul className="space-y-3">
          {staffYield.map((staff, idx) => (
            <li key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-gray-600">{staff.salesperson_name}</span>
              <span className="font-bold text-indigo-600">₹{staff.GMV.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Loyalty vs Guest */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-gray-800">Loyalty vs Guest</h2>
          <p className="text-gray-500 text-sm mt-1">Basket Identity Rate from POS</p>
        </div>
        <div className="flex space-x-12">
          <div className="text-center">
            <span className="block text-4xl font-black text-purple-600">{loyalty.Loyalty || 0}</span>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Registered</span>
          </div>
          <div className="text-center">
            <span className="block text-4xl font-black text-gray-300">{loyalty.Guest || 0}</span>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Guest</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardExtensions;