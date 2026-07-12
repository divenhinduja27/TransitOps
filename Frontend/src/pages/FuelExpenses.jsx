import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import Header from '../components/Header';

const FuelExpenses = () => {
  const { 
    vehicles, 
    fuelLogs, 
    expenses, 
    maintenance,
    addFuelLog, 
    addExpense,
    currency,
    distanceUnit,
    formatCost,
    formatDistance
  } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  
  const currencySymbol = currency.includes('$') ? '$' : currency.includes('€') ? '€' : currency.includes('£') ? '£' : '₹';
  const distanceSuffix = distanceUnit === 'Miles' ? 'mi' : distanceUnit === 'Nautical Miles' ? 'nm' : 'km';

  // State for forms
  const [activeForm, setActiveForm] = useState('fuel'); // 'fuel' or 'expense'
  const [fuelData, setFuelData] = useState({
    vehicleId: '',
    date: new Date().toISOString().split('T')[0],
    liters: '',
    cost: '',
    odometer: ''
  });
  
  const [expenseData, setExpenseData] = useState({
    vehicleId: '',
    type: 'Toll Charges',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [fuelError, setFuelError] = useState('');
  const [fuelSuccess, setFuelSuccess] = useState('');
  const [expenseError, setExpenseError] = useState('');
  const [expenseSuccess, setExpenseSuccess] = useState('');

  const [submittingFuel, setSubmittingFuel] = useState(false);
  const [submittingExpense, setSubmittingExpense] = useState(false);

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    setFuelError('');
    setFuelSuccess('');
    setSubmittingFuel(true);

    if (!fuelData.vehicleId) {
      setFuelError('Please select a vehicle.');
      setSubmittingFuel(false);
      return;
    }

    try {
      await addFuelLog(fuelData);
      setFuelSuccess('Fuel log successfully added.');
      setFuelData({
        vehicleId: '',
        date: new Date().toISOString().split('T')[0],
        liters: '',
        cost: '',
        odometer: ''
      });
    } catch (err) {
      setFuelError(err.response?.data?.error || err.message || 'Failed to save fuel log.');
    } finally {
      setSubmittingFuel(false);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setExpenseError('');
    setExpenseSuccess('');
    setSubmittingExpense(true);

    if (!expenseData.vehicleId) {
      setExpenseError('Please select a vehicle.');
      setSubmittingExpense(false);
      return;
    }

    try {
      await addExpense(expenseData);
      setExpenseSuccess('Expense successfully recorded.');
      setExpenseData({
        vehicleId: '',
        type: 'Toll Charges',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    } catch (err) {
      setExpenseError(err.response?.data?.error || err.message || 'Failed to record expense.');
    } finally {
      setSubmittingExpense(false);
    }
  };

  const getVehicleReg = (vehicleId) => {
    const v = vehicles.find(veh => veh.id === vehicleId);
    return v ? v.registrationNumber : vehicleId;
  };

  // Filter lists by search query (registration number)
  const filteredFuelLogs = fuelLogs.filter(f => 
    getVehicleReg(f.vehicleId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExpenses = expenses.filter(e => 
    getVehicleReg(e.vehicleId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Operational Cost Summary calculations
  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + Number(f.cost), 0);
  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + Number(m.cost), 0);
  const totalTollCharges = expenses.filter(e => e.type === 'Toll Charges').reduce((sum, e) => sum + Number(e.amount), 0);
  const totalMiscExpenses = expenses.filter(e => e.type !== 'Toll Charges').reduce((sum, e) => sum + Number(e.amount), 0);
  const grandTotalOpex = totalFuelCost + totalMaintenanceCost + totalTollCharges + totalMiscExpenses;

  return (
    <>
      <style>{`
        .glass-card {
            background: var(--bg-card);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-color);
            transition: background-color 250ms ease, border-color 250ms ease;
        }
        .form-input {
            background-color: var(--bg-app);
            border: 1px solid var(--border-color);
            color: var(--color-text-primary);
            width: 100%;
            height: 40px;
            padding: 0 12px;
            border-radius: 6px;
            outline: none;
            transition: all 250ms ease;
        }
        .form-input:focus {
            border-color: #ff8a00;
        }
      `}</style>

      <main className="ml-[260px] min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--color-text-secondary)] transition-all duration-200">
        <Header 
          title="Fuel & Expenses" 
          subtitle="Log operational transactions, fuel top-ups, and permit clearances"
          searchPlaceholder="Search logs by vehicle reg#..."
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="p-6 flex flex-col xl:flex-row gap-6 flex-grow">
          {/* LEFT: Log Transaction Forms & Summary */}
          <div className="xl:w-1/3 space-y-6">
            <div className="glass-card p-6 rounded-xl border border-[var(--border-color)]">
              {/* Form Toggles */}
              <div className="flex border-b border-[var(--border-color)] pb-3 mb-6 gap-2">
                <button
                  type="button"
                  onClick={() => { setActiveForm('fuel'); setFuelSuccess(''); setFuelError(''); }}
                  className={`flex-1 py-2 text-center text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    activeForm === 'fuel' 
                      ? 'bg-[#ff8a00] text-black' 
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] bg-[var(--bg-app)]/50'
                  }`}
                >
                  Fuel Log
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveForm('expense'); setExpenseSuccess(''); setExpenseError(''); }}
                  className={`flex-1 py-2 text-center text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    activeForm === 'expense' 
                      ? 'bg-[#ff8a00] text-black' 
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] bg-[var(--bg-app)]/50'
                  }`}
                >
                  Other Expense
                </button>
              </div>

              {activeForm === 'fuel' ? (
                /* FUEL FORM */
                <form onSubmit={handleFuelSubmit} className="space-y-4">
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ff8a00]">local_gas_station</span>
                    Record Fuel Purchase
                  </h4>
                  {fuelError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs flex gap-2">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      <span>{fuelError}</span>
                    </div>
                  )}
                  {fuelSuccess && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-xs flex gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>{fuelSuccess}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Vehicle</label>
                    <select
                      className="form-input"
                      required
                      value={fuelData.vehicleId}
                      onChange={(e) => setFuelData({ ...fuelData, vehicleId: e.target.value })}
                    >
                      <option value="">-- Choose Vehicle --</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.registrationNumber} ({v.make})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Liters Filled</label>
                      <input
                        className="form-input"
                        type="number"
                        step="any"
                        required
                        placeholder="e.g. 120"
                        value={fuelData.liters}
                        onChange={(e) => setFuelData({ ...fuelData, liters: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Total Cost ({currencySymbol})</label>
                      <input
                        className="form-input"
                        type="number"
                        required
                        placeholder="e.g. 11000"
                        value={fuelData.cost}
                        onChange={(e) => setFuelData({ ...fuelData, cost: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Odometer ({distanceSuffix})</label>
                      <input
                        className="form-input"
                        type="number"
                        required
                        placeholder="e.g. 45000"
                        value={fuelData.odometer}
                        onChange={(e) => setFuelData({ ...fuelData, odometer: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Purchase Date</label>
                      <input
                        className="form-input"
                        type="date"
                        required
                        value={fuelData.date}
                        onChange={(e) => setFuelData({ ...fuelData, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingFuel}
                    className="w-full h-11 bg-[#ff8a00] text-black font-bold rounded-lg hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[20px]">{submittingFuel ? 'sync' : 'save'}</span>
                    {submittingFuel ? 'Adding Record...' : 'Add Fuel Record'}
                  </button>
                </form>
              ) : (
                /* EXPENSE FORM */
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ff8a00]">payments</span>
                    Record Operating Expense
                  </h4>
                  {expenseError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs flex gap-2">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      <span>{expenseError}</span>
                    </div>
                  )}
                  {expenseSuccess && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-xs flex gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>{expenseSuccess}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Vehicle</label>
                    <select
                      className="form-input"
                      required
                      value={expenseData.vehicleId}
                      onChange={(e) => setExpenseData({ ...expenseData, vehicleId: e.target.value })}
                    >
                      <option value="">-- Choose Vehicle --</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.registrationNumber} ({v.make})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Expense Type</label>
                      <select
                        className="form-input"
                        value={expenseData.type}
                        onChange={(e) => setExpenseData({ ...expenseData, type: e.target.value })}
                      >
                        <option value="Toll Charges">Toll Charges</option>
                        <option value="Driver Allowance">Driver Allowance</option>
                        <option value="State Permit Fee">State Permit Fee</option>
                        <option value="Insurance Claim">Insurance Claim</option>
                        <option value="General Maintenance">General Maintenance</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Amount ({currencySymbol})</label>
                      <input
                        className="form-input"
                        type="number"
                        required
                        placeholder="e.g. 1500"
                        value={expenseData.amount}
                        onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Transaction Date</label>
                      <input
                        className="form-input"
                        type="date"
                        required
                        value={expenseData.date}
                        onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Short Description</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      placeholder="e.g. Toll charges on highway toll booth"
                      value={expenseData.description}
                      onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingExpense}
                    className="w-full h-11 bg-[#ff8a00] text-black font-bold rounded-lg hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[20px]">{submittingExpense ? 'sync' : 'save'}</span>
                    {submittingExpense ? 'Recording Expense...' : 'Add Expense Record'}
                  </button>
                </form>
              )}
            </div>

            {/* Operational Cost Summary Card */}
            <div className="glass-card p-6 rounded-xl border border-[var(--border-color)] space-y-4">
              <h3 className="text-base font-bold pb-2 border-b border-[var(--border-color)] flex items-center gap-2 text-[var(--color-text-primary)]">
                <span className="material-symbols-outlined text-[#ff8a00]">summarize</span>
                Operational Cost Summary
              </h3>
              <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Fuel Cost:</span>
                  <span className="font-mono font-semibold">{formatCost(totalFuelCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Maintenance Cost:</span>
                  <span className="font-mono font-semibold">{formatCost(totalMaintenanceCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Toll Charges:</span>
                  <span className="font-mono font-semibold">{formatCost(totalTollCharges)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Miscellaneous Expenses:</span>
                  <span className="font-mono font-semibold">{formatCost(totalMiscExpenses)}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border-color)] pt-3 text-base font-bold text-[var(--color-text-primary)]">
                  <span>Total Operational Cost:</span>
                  <span className="font-mono text-[#ff8a00]">{formatCost(grandTotalOpex)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Transaction Logs List */}
          <div className="flex-grow space-y-6">
            {/* Fuel Log Table */}
            <div className="glass-card p-6 rounded-xl border border-[var(--border-color)] flex flex-col">
              <h3 className="text-base font-bold mb-4 pb-2 border-b border-[var(--border-color)] flex items-center gap-2 text-[var(--color-text-primary)]">
                <span className="material-symbols-outlined text-[#ff8a00]">local_gas_station</span>
                Fuel Purchases History
              </h3>
              <div className="overflow-x-auto max-h-[250px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[var(--color-text-muted)] text-xs font-bold uppercase">
                      <th className="py-2.5 px-2">Date</th>
                      <th className="py-2.5 px-2">Vehicle</th>
                      <th className="py-2.5 px-2 text-right">Liters</th>
                      <th className="py-2.5 px-2 text-right">Odometer</th>
                      <th className="py-2.5 px-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]/40 text-[var(--color-text-secondary)]">
                    {filteredFuelLogs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-[var(--color-text-muted)]">No fuel records logged.</td>
                      </tr>
                    ) : (
                      filteredFuelLogs.map(f => (
                        <tr key={f.id} className="hover:bg-[var(--bg-app)] transition-colors">
                          <td className="py-2 px-2 text-xs font-mono">{f.date}</td>
                          <td className="py-2 px-2 text-xs font-bold text-[#ff8a00]">{getVehicleReg(f.vehicleId)}</td>
                          <td className="py-2 px-2 text-xs text-right font-mono">{f.liters} L</td>
                          <td className="py-2 px-2 text-xs text-right font-mono">{formatDistance(f.odometer)}</td>
                          <td className="py-2 px-2 text-xs text-right font-mono font-bold text-[#ff8a00]">{formatCost(f.cost)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Other Expenses Table */}
            <div className="glass-card p-6 rounded-xl border border-[var(--border-color)] flex flex-col">
              <h3 className="text-base font-bold mb-4 pb-2 border-b border-[var(--border-color)] flex items-center gap-2 text-[var(--color-text-primary)]">
                <span className="material-symbols-outlined text-[#ff8a00]">payments</span>
                Misc Operational Expenditures
              </h3>
              <div className="overflow-x-auto max-h-[250px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[var(--color-text-muted)] text-xs font-bold uppercase">
                      <th className="py-2.5 px-2">Date</th>
                      <th className="py-2.5 px-2">Vehicle</th>
                      <th className="py-2.5 px-2">Type</th>
                      <th className="py-2.5 px-2">Description</th>
                      <th className="py-2.5 px-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]/40 text-[var(--color-text-secondary)]">
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-[var(--color-text-muted)]">No custom expenses logged.</td>
                      </tr>
                    ) : (
                      filteredExpenses.map(e => (
                        <tr key={e.id} className="hover:bg-[var(--bg-app)] transition-colors">
                          <td className="py-2 px-2 text-xs font-mono">{e.date}</td>
                          <td className="py-2 px-2 text-xs font-bold text-[#ff8a00]">{getVehicleReg(e.vehicleId)}</td>
                          <td className="py-2 px-2 text-xs">{e.type}</td>
                          <td className="py-2 px-2 text-xs text-[var(--color-text-muted)]">{e.description}</td>
                          <td className="py-2 px-2 text-xs text-right font-mono font-bold text-[#ff8a00]">{formatCost(e.amount)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default FuelExpenses;
