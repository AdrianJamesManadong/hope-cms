import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../services/customerService';
import { salesService } from '../services/salesService';

function CustomerDetailPage() {
  const { custno } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [sales, setSales] = useState([]);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);

  const [selectedTrans, setSelectedTrans] = useState(null);
  const [transDetail, setTransDetail] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadCustomer();
    loadSales();
  }, [custno]);

  const loadCustomer = async () => {
    setLoadingCustomer(true);

    const { data, error } = await import('../lib/supabaseClient.js').then(
      ({ supabase }) =>
        supabase
          .from('customer')
          .select('*')
          .eq('custno', custno)
          .single()
    );

    if (!error) setCustomer(data);

    setLoadingCustomer(false);
  };

  const loadSales = async () => {
    setLoadingSales(true);

    const { data } = await salesService.getSalesByCustomer(custno);

    setSales(data || []);
    setLoadingSales(false);
  };

  const openTransDetail = async (trans) => {
    setSelectedTrans(trans);
    setLoadingDetail(true);
    setShowDetailModal(true);

    const { data } = await salesService.getSalesDetailWithProducts(trans.transno);

    setTransDetail(data || []);
    setLoadingDetail(false);
  };

  const totalTransactions = sales.length;

  if (loadingCustomer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl px-10 py-8 text-gray-500 text-sm font-medium">
          Loading customer...
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 flex items-center justify-center text-3xl mb-5">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Customer Not Found
          </h2>

          <p className="text-gray-500 mb-6 text-sm">
            The customer record you are looking for does not exist.
          </p>

          <button
            onClick={() => navigate('/customers')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-medium transition"
          >
            ← Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/customers')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 transition"
          >
            ← Back to Customers
          </button>

          <h1 className="text-4xl font-black tracking-tight text-gray-900">
            Customer Details
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            View customer information and transaction history.
          </p>
        </div>

        <div>
          <span
            className={`px-4 py-2 rounded-2xl text-sm font-semibold shadow-sm border ${
              customer.record_status === 'ACTIVE'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {customer.record_status}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl p-6 shadow-xl shadow-blue-100">
          <p className="text-sm text-blue-100 uppercase tracking-wide">
            Customer Number
          </p>
          <h2 className="text-3xl font-black mt-3 font-mono">
            {customer.custno}
          </h2>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition">
          <p className="text-sm text-gray-400 uppercase tracking-wide">
            Payment Term
          </p>
          <h2 className="text-3xl font-black text-gray-800 mt-3">
            {customer.payterm}
          </h2>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition">
          <p className="text-sm text-gray-400 uppercase tracking-wide">
            Total Transactions
          </p>
          <h2 className="text-3xl font-black text-blue-600 mt-3">
            {totalTransactions}
          </h2>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-2xl font-bold text-gray-800">
            Customer Profile
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Customer information and account details.
          </p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Customer Name
            </p>
            <p className="text-xl font-bold text-gray-800">
              {customer.custname}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Address
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              {customer.address}
            </p>
          </div>
        </div>
      </div>

      {/* Sales History */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Sales History
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Click any transaction to view detailed line items.
            </p>
          </div>

          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-sm font-semibold">
            {sales.length} transaction{sales.length !== 1 ? 's' : ''}
          </div>
        </div>

        {loadingSales ? (
          <div className="p-16 text-center text-gray-400 text-sm">
            Loading sales history...
          </div>
        ) : sales.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-gray-500 font-medium">
              No sales recorded for this customer.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                    Trans No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                    Sales Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                    Employee No
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {sales.map((sale) => (
                  <tr
                    key={sale.transno}
                    onClick={() => openTransDetail(sale)}
                    className="border-b border-gray-100 hover:bg-blue-50/60 transition cursor-pointer"
                  >
                    <td className="px-6 py-5 font-mono text-sm font-semibold text-gray-800">
                      {sale.transno}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {sale.salesdate}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {sale.empno}
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl text-xs font-semibold">
                        View Details →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showDetailModal && selectedTrans && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-blue-50 to-white">
              <div>
                <h3 className="text-2xl font-black text-gray-800">
                  Transaction {selectedTrans.transno}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Date: {selectedTrans.salesdate} • Employee: {selectedTrans.empno}
                </p>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition text-xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto">
              {loadingDetail ? (
                <div className="p-16 text-center text-gray-400 text-sm">
                  Loading line items...
                </div>
              ) : transDetail.length === 0 ? (
                <div className="p-16 text-center text-gray-400 text-sm">
                  No line items found.
                </div>
              ) : (
                <table className="w-full min-w-[700px]">
                  <thead className="bg-gray-50 sticky top-0 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Prod Code
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Unit
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                        Qty
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {transDetail.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-5 font-mono text-sm font-semibold text-gray-800">
                          {item.prodcode}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-700">
                          {item.product?.description ?? '—'}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-500">
                          {item.product?.unit ?? '—'}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-sm font-semibold">
                            {item.quantity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-sm font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDetailPage;