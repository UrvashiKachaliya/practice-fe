import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FaUsers, FaBoxOpen, FaStore, FaTrash, FaShoppingBag, FaRupeeSign } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import {
  getAdminStats, getAdminUsers, updateUserRole,
  deleteUser, getAdminProducts, deleteProduct,
  getAdminOrders, updateOrderStatus, respondDeliveryDate,
  getAdminOffers, createOffer, updateOffer, deleteOffer,
  getAdminReviews,  deleteReview, addManualReview, getAllProducts,
} from "../helpers/apiRequest";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { EditProductModal } from "./AddProduct";

const TABS = ["Overview", "Orders", "Offers", "Reviews", "Users", "Products"];

const roleBadge = {
  admin: "bg-purple-100 text-purple-600",
  seller: "bg-blue-100 text-blue-600",
  user: "bg-orange-100 text-orange-600",
};

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-xl font-extrabold text-gray-800">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function ConfirmDelete({ label, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl p-7 w-full max-w-sm text-center">
        <div className="text-4xl mb-3">🗑️</div>
        <h3 className="font-extrabold text-gray-800 mb-1">Delete {label}?</h3>
        <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────
function Overview() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: () => getAdminStats().then(r => r.data) });

  if (isLoading) return <Spinner />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <StatCard icon={<FaUsers />} label="Total Users" value={data?.totalUsers} color="bg-orange-50 text-orange-500" />
      <StatCard icon={<FaStore />} label="Total Sellers" value={data?.totalSellers} color="bg-blue-50 text-blue-500" />
      <StatCard icon={<FaBoxOpen />} label="Total Products" value={data?.totalProducts} color="bg-green-50 text-green-500" />
      <StatCard icon={<FaShoppingBag />} label="This Month Orders" value={data?.totalOrders} color="bg-purple-50 text-purple-500" />
      <StatCard icon={<FaRupeeSign />} label="This Month Revenue" value={data?.revenue ? `₹${parseFloat(data.revenue).toFixed(0)}` : "₹0"} color="bg-amber-50 text-amber-500" />
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────
function Users() {
  const qc = useQueryClient();
  const [confirm, setConfirm] = useState(null);
  const { data: users = [], isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: () => getAdminUsers().then(r => r.data) });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => { qc.invalidateQueries(["admin-users"]); qc.invalidateQueries(["admin-stats"]); toast.success("Role updated"); },
    onError: () => toast.error("Failed to update role"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => { qc.invalidateQueries(["admin-users"]); qc.invalidateQueries(["admin-stats"]); toast.success("User deleted"); setConfirm(null); },
    onError: () => toast.error("Failed to delete user"),
  });

  if (isLoading) return <Spinner />;

  return (
    <>
      {confirm && (
        <ConfirmDelete
          label={`user "${confirm.name}"`}
          onConfirm={() => deleteMutation.mutate(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {users.map(u => (
            <div key={u.id} className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{u.name}</p>
                <p className="text-xs text-gray-400 truncate">{u.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <select value={u.role} onChange={e => roleMutation.mutate({ id: u.id, role: e.target.value })}
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border-0 cursor-pointer focus:outline-none ${roleBadge[u.role]}`}>
                    <option value="user">user</option>
                    <option value="seller">seller</option>
                    <option value="admin">admin</option>
                  </select>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.is_verified ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                    {u.is_verified ? "✓" : "✗"}
                  </span>
                </div>
              </div>
              <button onClick={() => setConfirm(u)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 shrink-0">
                <FaTrash size={13} />
              </button>
            </div>
          ))}
        </div>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Name","Email","Contact","Role","Verified","Action"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-orange-50/30 transition">
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{u.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3.5 text-gray-500">{u.contact || "—"}</td>
                  <td className="px-5 py-3.5">
                    <select value={u.role} onChange={e => roleMutation.mutate({ id: u.id, role: e.target.value })}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-300 ${roleBadge[u.role]}`}>
                      <option value="user">user</option>
                      <option value="seller">seller</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.is_verified ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                      {u.is_verified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setConfirm(u)} className="text-red-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50"><FaTrash size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Products Tab ──────────────────────────────────────────────
function Products() {
  const qc = useQueryClient();
  const [confirm, setConfirm] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const { data: products = [], isLoading } = useQuery({ queryKey: ["admin-products"], queryFn: () => getAdminProducts().then(r => r.data) });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => { qc.invalidateQueries(["admin-products"]); qc.invalidateQueries(["admin-stats"]); toast.success("Product deleted"); setConfirm(null); },
    onError: () => toast.error("Failed to delete product"),
  });

  const openEdit = (p) => setEditProduct(p);

  if (isLoading) return <Spinner />;

  return (
    <>
      {confirm && (
        <ConfirmDelete
          label={`"${confirm.title}"`}
          onConfirm={() => deleteMutation.mutate(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {editProduct && <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} />}  


      <div className="flex justify-end mb-4">
        <Link to="/products/add" className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition">
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {products.map(p => (
            <div key={p.id} className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 text-sm truncate">{p.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full">{p.category}</span>
                  <span className="text-xs font-semibold text-gray-700">₹{p.price}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>{p.stock > 0 ? p.stock : "Out"}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>{p.status || "active"}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(p)} className="text-blue-400 p-1.5 rounded-lg hover:bg-blue-50"><FaPen size={12} /></button>
                <button onClick={() => setConfirm(p)} className="text-red-400 p-1.5 rounded-lg hover:bg-red-50"><FaTrash size={13} /></button>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Title","Category","Price","Stock","Seller","Status","Action"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-orange-50/30 transition">
                  <td className="px-5 py-3.5 font-semibold text-gray-800 max-w-[180px] truncate">{p.title}</td>
                  <td className="px-5 py-3.5"><span className="text-xs bg-orange-100 text-orange-500 px-2.5 py-1 rounded-full font-medium">{p.category}</span></td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700">₹{p.price}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>{p.stock > 0 ? p.stock : "Out"}</span></td>
                  <td className="px-5 py-3.5 text-gray-500">{p.seller_name}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>{p.status || "active"}</span></td>
                  <td className="px-5 py-3.5 flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="text-blue-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50"><FaPen size={12} /></button>
                    <button onClick={() => setConfirm(p)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50"><FaTrash size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Orders Tab ───────────────────────────────────────────────
const statusStyle = {
  pending:   "bg-yellow-100 text-yellow-600",
  confirmed: "bg-blue-100 text-blue-600",
  shipped:   "bg-purple-100 text-purple-600",
  delivered: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-500",
};

const deliveryResponseStyle = {
  pending:  "bg-yellow-50 text-yellow-600",
  accepted: "bg-green-50 text-green-600",
  rejected: "bg-red-50 text-red-500",
};

function DeliveryResponseModal({ order, onClose }) {
  const qc = useQueryClient();
  const [action, setAction] = useState("accept");
  const [adminDate, setAdminDate] = useState("");
  const [reason, setReason] = useState("Due to high order volume, we are unable to accommodate your requested date. We sincerely apologize for any inconvenience.");

  const { mutate, isPending } = useMutation({
    mutationFn: () => respondDeliveryDate(order.id, { action, adminDate: adminDate || null, reason: action === "reject" ? reason : null }),
    onSuccess: () => { qc.invalidateQueries(["admin-orders"]); toast.success("Response sent to customer!"); onClose(); },
    onError: () => toast.error("Failed to send response"),
  });

  const requestedDate = order.requested_delivery_date
    ? new Date(order.requested_delivery_date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-md">
        <h3 className="font-extrabold text-gray-800 text-lg mb-1">Respond to Delivery Request</h3>
        <p className="text-gray-400 text-sm mb-5">Order #{order.id} — {order.user_name}</p>

        {/* Customer's requested date */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Customer Requested</p>
          <p className="font-extrabold text-gray-800">{requestedDate || "No specific date"}</p>
        </div>

        {/* Accept / Reject toggle */}
        <div className="flex gap-2 mb-5">
          <button onClick={() => setAction("accept")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${action === "accept" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-green-50"}`}>
            ✅ Accept
          </button>
          <button onClick={() => setAction("reject")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${action === "reject" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-red-50"}`}>
            ❌ Reject
          </button>
        </div>

        {/* Admin's alternate date (shown for both) */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {action === "accept" ? "Confirm Delivery Date" : "Suggest Alternate Date (optional)"}
          </label>
          <input type="date" value={adminDate} onChange={e => setAdminDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
        </div>

        {/* Rejection reason */}
        {action === "reject" && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Reason for Rejection</label>
            <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 resize-none" />
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => mutate()} disabled={isPending}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition ${action === "accept" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}>
            {isPending ? "Sending..." : action === "accept" ? "Confirm & Notify" : "Reject & Notify"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const qc = useQueryClient();
  const [deliveryModal, setDeliveryModal] = useState(null);
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => getAdminOrders().then(r => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => { qc.invalidateQueries(["admin-orders"]); qc.invalidateQueries(["admin-stats"]); toast.success("Order updated"); },
    onError: () => toast.error("Failed to update order"),
  });

  if (isLoading) return <Spinner />;

  if (orders.length === 0)
    return <div className="text-center py-16 text-gray-400">No orders this month.</div>;

  return (
    <>
      {deliveryModal && <DeliveryResponseModal order={deliveryModal} onClose={() => setDeliveryModal(null)} />}

      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-600">This Month's Orders</p>
          <span className="text-xs bg-orange-100 text-orange-500 px-2.5 py-1 rounded-full font-semibold">{orders.length} orders</span>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {orders.map(o => {
            const items = typeof o.items === "string" ? JSON.parse(o.items) : (o.items || []);
            const hasDeliveryRequest = !!o.requested_delivery_date;
            const deliveryResponse = o.delivery_response || "pending";
            return (
              <div key={o.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">#{o.id} — {o.user_name}</p>
                    <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusStyle[o.status]}`}>{o.status}</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {items.map((item, i) => <p key={i} className="truncate">{item.title} ({item.weight} ×{item.quantity})</p>)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-bold text-orange-500">₹{parseFloat(o.total_amount).toFixed(2)}</p>
                    {o.payment_method && (
                      <span className="text-xs text-gray-400 capitalize">
                        {o.payment_method === "cod" ? "💵 Cash on Delivery" : (
                          <>
                            {o.payment_method}
                            {o.payment_method === "card" && o.card_last4 && ` ••• ${o.card_last4}`}
                            {o.payment_method === "upi" && o.vpa && ` • ${o.vpa}`}
                            {o.payment_method === "netbanking" && o.bank && ` • ${o.bank}`}
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {hasDeliveryRequest && deliveryResponse === "pending" && (
                      <button onClick={() => setDeliveryModal(o)} className="text-xs font-bold text-orange-500 border border-orange-300 px-2 py-1 rounded-lg">Respond</button>
                    )}
                    <select value={o.status} onChange={e => statusMutation.mutate({ id: o.id, status: e.target.value })}
                      disabled={o.status === "cancelled" || o.status === "delivered"}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none disabled:opacity-50">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Order ID","Customer","Items","Total","Payment","Delivery Request","Status","Date","Action"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(o => {
                const items = typeof o.items === "string" ? JSON.parse(o.items) : (o.items || []);
                const hasDeliveryRequest = !!o.requested_delivery_date;
                const deliveryResponse = o.delivery_response || "pending";
                return (
                  <tr key={o.id} className="hover:bg-orange-50/30 transition">
                    <td className="px-5 py-3.5 font-bold text-gray-800">#{o.id}</td>
                    <td className="px-5 py-3.5"><p className="font-semibold text-gray-800 text-xs">{o.user_name}</p><p className="text-gray-400 text-xs">{o.user_email}</p></td>
                    <td className="px-5 py-3.5 max-w-[160px]">{items.map((item, i) => <p key={i} className="text-xs text-gray-600 truncate">{item.title} ({item.weight} ×{item.quantity})</p>)}</td>
                    <td className="px-5 py-3.5 font-bold text-orange-500">₹{parseFloat(o.total_amount).toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      {o.payment_method ? (
                        <div className="flex flex-col gap-0.5">
                          {o.payment_method === "cod" ? (
                            <span className="text-xs font-bold text-green-600 flex items-center gap-1">💵 Cash on Delivery</span>
                          ) : (
                            <>
                              <span className="text-xs font-bold text-gray-700 capitalize">{o.payment_method}</span>
                              {o.payment_method === "card" && o.card_network && <span className="text-xs text-gray-400">{o.card_network} •••• {o.card_last4}</span>}
                              {o.payment_method === "upi" && o.vpa && <span className="text-xs text-gray-400">{o.vpa}</span>}
                              {o.payment_method === "netbanking" && o.bank && <span className="text-xs text-gray-400">{o.bank}</span>}
                              {o.payment_method === "wallet" && o.wallet && <span className="text-xs text-gray-400">{o.wallet}</span>}
                            </>
                          )}
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${ o.payment_status === "paid" || o.payment_status === "cod" ? "bg-green-100 text-green-600" : o.payment_status === "refunded" ? "bg-blue-100 text-blue-600" : "bg-yellow-100 text-yellow-600"}`}>
                            {o.payment_status === "cod" ? "COD" : o.payment_status || "pending"}
                          </span>
                        </div>
                      ) : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      {hasDeliveryRequest ? (
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-semibold text-gray-700">{new Date(o.requested_delivery_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${deliveryResponseStyle[deliveryResponse]}`}>{deliveryResponse}</span>
                          {deliveryResponse === "pending" && <button onClick={() => setDeliveryModal(o)} className="text-xs font-bold text-orange-500 hover:text-orange-600 underline mt-0.5">Respond</button>}
                        </div>
                      ) : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3.5"><span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusStyle[o.status]}`}>{o.status}</span></td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                    <td className="px-5 py-3.5">
                      <select value={o.status} onChange={e => statusMutation.mutate({ id: o.id, status: e.target.value })}
                        disabled={o.status === "cancelled" || o.status === "delivered"}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 cursor-pointer">
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Offers Tab ───────────────────────────────────────────────
const EMPTY_OFFER = {
  title: "",
  subtitle: "",
  badge: "",
  bg_from: "#f97316",
  bg_to: "#f59e0b",
  emoji: "🎁",
  expires_at: "",
  is_active: true,
  code: "",
  discount_type: "percentage",
  discount_value: 10,
  min_order_amount: 0,
  max_uses: "",
};

function Offers() {
  const qc = useQueryClient();
  const [form, setForm] = useState(EMPTY_OFFER);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: () => getAdminOffers().then(r => r.data),
  });

  const invalidate = () => qc.invalidateQueries(["admin-offers"]);

  const saveMutation = useMutation({
    mutationFn: () => editing ? updateOffer(editing, form) : createOffer(form),
    onSuccess: () => { invalidate(); toast.success(editing ? "Offer updated" : "Offer created"); setShowForm(false); setEditing(null); setForm(EMPTY_OFFER); },
    onError: () => toast.error("Failed to save offer"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => { invalidate(); toast.success("Offer deleted"); },
    onError: () => toast.error("Failed to delete"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, data }) => updateOffer(id, data),
    onSuccess: () => { invalidate(); toast.success("Offer updated"); },
  });

  const openEdit = (offer) => {
    setForm({ ...offer, expires_at: offer.expires_at ? offer.expires_at.slice(0, 16) : "" });
    setEditing(offer.id);
    setShowForm(true);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col gap-5">
      {/* Add Offer Button */}
      <div className="flex justify-end">
        <button
          onClick={() => { setForm(EMPTY_OFFER); setEditing(null); setShowForm(true); }}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:from-orange-600 hover:to-amber-600 transition shadow-sm"
        >
          + New Offer
        </button>
      </div>

      {/* Offer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-gray-800 text-lg mb-5">{editing ? "Edit Offer" : "Create Offer"}</h3>
            <div className="flex flex-col gap-3">
              {[{k:"title",label:"Title *",ph:"e.g. Mother's Day BOGO"},{k:"subtitle",label:"Subtitle",ph:"Buy 1 Get 1 Free on all khakhras"},{k:"badge",label:"Badge",ph:"e.g. Limited Time"}].map(({k,label,ph}) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} placeholder={ph}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Emoji</label>
                  <input value={form.emoji} onChange={e => setForm({...form,emoji:e.target.value})} placeholder="🎁"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 text-center text-xl" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Color From</label>
                  <input type="color" value={form.bg_from} onChange={e => setForm({...form,bg_from:e.target.value})}
                    className="w-full h-10 rounded-xl border border-gray-200 cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Color To</label>
                  <input type="color" value={form.bg_to} onChange={e => setForm({...form,bg_to:e.target.value})}
                    className="w-full h-10 rounded-xl border border-gray-200 cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Expires At (optional)</label>
                <input type="datetime-local" value={form.expires_at} onChange={e => setForm({...form,expires_at:e.target.value})}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Coupon Code</label>
                  <input value={form.code || ""} onChange={e => setForm({...form,code:e.target.value.toUpperCase()})} placeholder="CRISPY10"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 font-bold uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Discount Type</label>
                  <select value={form.discount_type || "percentage"} onChange={e => setForm({...form,discount_type:e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50">
                    <option value="percentage">Percentage off</option>
                    <option value="flat">Flat amount off</option>
                    <option value="bogo">BOGO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Discount Value</label>
                  <input type="number" min="0" value={form.discount_value ?? 0} onChange={e => setForm({...form,discount_value:e.target.value})}
                    disabled={form.discount_type === "bogo"}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 disabled:opacity-60" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Minimum Order</label>
                  <input type="number" min="0" value={form.min_order_amount ?? 0} onChange={e => setForm({...form,min_order_amount:e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Max Uses</label>
                  <input type="number" min="1" value={form.max_uses || ""} onChange={e => setForm({...form,max_uses:e.target.value})} placeholder="Unlimited"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
                </div>
                <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-600">
                  <input type="checkbox" checked={!!form.is_active} onChange={e => setForm({...form,is_active:e.target.checked})}
                    className="accent-orange-500" />
                  Active
                </label>
              </div>
              {/* Preview */}
              <div className="rounded-2xl p-4 text-white flex items-center gap-3" style={{background:`linear-gradient(135deg,${form.bg_from},${form.bg_to})`}}>
                <span className="text-3xl">{form.emoji}</span>
                <div>
                  {form.badge && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">{form.badge}</span>}
                  <p className="font-extrabold">{form.title || "Offer Title"}</p>
                  {form.subtitle && <p className="text-white/80 text-xs">{form.subtitle}</p>}
                  {form.code && <p className="text-white text-xs font-bold mt-1">Use code {form.code}</p>}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => saveMutation.mutate()} disabled={!form.title || saveMutation.isPending}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-60">
                {saveMutation.isPending ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offers List */}
      {offers.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No offers yet. Create your first one!</div>
      ) : (
        <div className="flex flex-col gap-3">
          {offers.map(offer => (
            <div key={offer.id} className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Preview strip */}
              <div className="md:w-48 p-4 flex items-center gap-3 text-white shrink-0" style={{background:`linear-gradient(135deg,${offer.bg_from},${offer.bg_to})`}}>
                <span className="text-3xl">{offer.emoji}</span>
                <div className="min-w-0">
                  <p className="font-extrabold text-sm truncate">{offer.title}</p>
                  {offer.subtitle && <p className="text-white/80 text-xs truncate">{offer.subtitle}</p>}
                </div>
              </div>
              {/* Info + actions */}
              <div className="flex-1 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-xs">
                  {offer.code && <span className="bg-amber-100 text-amber-600 px-2.5 py-1 rounded-full font-bold">{offer.code}</span>}
                  <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-semibold">
                    {offer.discount_type === "percentage" ? `${offer.discount_value}% off` : offer.discount_type === "flat" ? `₹${offer.discount_value} off` : "BOGO"}
                  </span>
                  {offer.badge && <span className="bg-orange-100 text-orange-500 px-2.5 py-1 rounded-full font-semibold">{offer.badge}</span>}
                  <span className={`px-2.5 py-1 rounded-full font-semibold ${offer.is_active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {offer.is_active ? "Active" : "Inactive"}
                  </span>
                  {offer.expires_at && (
                    <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                      Expires {new Date(offer.expires_at).toLocaleDateString("en-IN", {day:"numeric",month:"short"})}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleMutation.mutate({ id: offer.id, data: { ...offer, is_active: !offer.is_active } })}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${offer.is_active ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-green-100 text-green-600 hover:bg-green-200"}`}
                  >
                    {offer.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => openEdit(offer)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition">Edit</button>
                  <button onClick={() => deleteMutation.mutate(offer.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reviews Tab ──────────────────────────────────────────────
function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`text-xs ${s <= rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
      ))}
    </div>
  );
}

function Reviews() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productId: "", reviewerName: "", rating: 5, comment: "" });

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => getAdminReviews().then(r => r.data),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProducts().then(r => r.data.products),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-reviews"] });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => { invalidate(); toast.success("Review deleted"); },
    onError: () => toast.error("Failed to delete"),
  });

  const manualMutation = useMutation({
    mutationFn: addManualReview,
    onSuccess: () => { invalidate(); toast.success("Review published!"); setShowForm(false); setForm({ productId: "", reviewerName: "", rating: 5, comment: "" }); },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add review"),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-gray-700 text-sm">All Reviews</h3>
          <span className="bg-orange-100 text-orange-500 text-xs font-bold px-2 py-0.5 rounded-full">{reviews.length}</span>
        </div>
        <button onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:from-orange-600 hover:to-amber-600 transition shadow-sm">
          + Add Review
        </button>
      </div>

      {/* Manual Review Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-md">
            <h3 className="font-extrabold text-gray-800 text-lg mb-5">Add Review</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product *</label>
                <select value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50">
                  <option value="">Select product...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Reviewer Name *</label>
                <input value={form.reviewerName} onChange={e => setForm({ ...form, reviewerName: e.target.value })}
                  placeholder="e.g. Priya Shah"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Rating *</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })}
                      className={`text-2xl transition ${s <= form.rating ? "text-amber-400" : "text-gray-200"}`}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Comment</label>
                <textarea rows={3} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })}
                  placeholder="Write the review..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button
                onClick={() => manualMutation.mutate({ productId: Number(form.productId), reviewerName: form.reviewerName, rating: form.rating, comment: form.comment })}
                disabled={!form.productId || !form.reviewerName || manualMutation.isPending}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-60">
                {manualMutation.isPending ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No reviews yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {reviews.map(r => (
              <div key={r.id} className="p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs font-bold shrink-0">
                      {(r.reviewer_name || r.user_name)?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{r.reviewer_name || r.user_name}</span>
                    <StarDisplay rating={r.rating} />
                    <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full">{r.product_title}</span>
                    {r.is_manual && <span className="text-xs bg-purple-100 text-purple-500 px-2 py-0.5 rounded-full">Manual</span>}
                  </div>
                  {r.comment && <p className="text-sm text-gray-500 ml-9 leading-relaxed">{r.comment}</p>}
                  <p className="text-xs text-gray-300 ml-9 mt-1">
                    {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <button onClick={() => deleteMutation.mutate(r.id)}
                  className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 shrink-0 transition">
                  <FaTrash size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-amber-50 py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
            <MdDashboard size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">Manage users, products and monitor stats</p>
          </div>
        </div>

        {/* Tabs — scrollable on mobile */}
        <div className="flex gap-1 bg-white border border-orange-100 rounded-2xl p-1.5 mb-7 shadow-sm overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap shrink-0 ${tab === t ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm" : "text-gray-500 hover:text-orange-500"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "Overview" && <Overview />}
        {tab === "Orders" && <Orders />}
        {tab === "Offers" && <Offers />}
        {tab === "Reviews" && <Reviews />}
        {tab === "Users" && <Users />}
        {tab === "Products" && <Products />}
      </div>
    </div>
  );
}
