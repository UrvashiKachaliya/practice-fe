import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FaUsers, FaBoxOpen, FaStore, FaTrash, FaShoppingBag, FaRupeeSign } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import {
  getAdminStats, getAdminUsers, updateUserRole,
  deleteUser, getAdminProducts, deleteProduct,
  getAdminOrders, updateOrderStatus,
  getAdminOffers, createOffer, updateOffer, deleteOffer,
} from "../helpers/apiRequest";

const TABS = ["Overview", "Orders", "Offers", "Users", "Products"];

const roleBadge = {
  admin: "bg-purple-100 text-purple-600",
  seller: "bg-blue-100 text-blue-600",
  user: "bg-orange-100 text-orange-600",
};

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-3xl font-extrabold text-gray-800">{value ?? "—"}</p>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Email", "Contact", "Role", "Verified", "Action"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-orange-50/30 transition">
                  <td className="px-5 py-3.5 font-semibold text-gray-800">{u.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3.5 text-gray-500">{u.contact || "—"}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={u.role}
                      onChange={e => roleMutation.mutate({ id: u.id, role: e.target.value })}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-300 ${roleBadge[u.role]}`}
                    >
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
                    <button onClick={() => setConfirm(u)} className="text-red-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50">
                      <FaTrash size={13} />
                    </button>
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
  const { data: products = [], isLoading } = useQuery({ queryKey: ["admin-products"], queryFn: () => getAdminProducts().then(r => r.data) });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => { qc.invalidateQueries(["admin-products"]); qc.invalidateQueries(["admin-stats"]); toast.success("Product deleted"); setConfirm(null); },
    onError: () => toast.error("Failed to delete product"),
  });

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
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Title", "Category", "Price", "Stock", "Seller", "Action"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-orange-50/30 transition">
                  <td className="px-5 py-3.5 font-semibold text-gray-800 max-w-[180px] truncate">{p.title}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs bg-orange-100 text-orange-500 px-2.5 py-1 rounded-full font-medium">{p.category}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700">₹{p.price}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                      {p.stock > 0 ? p.stock : "Out"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{p.seller_name}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setConfirm(p)} className="text-red-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50">
                      <FaTrash size={13} />
                    </button>
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

function Orders() {
  const qc = useQueryClient();
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
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
        <p className="text-sm font-bold text-gray-600">This Month's Orders</p>
        <span className="text-xs bg-orange-100 text-orange-500 px-2.5 py-1 rounded-full font-semibold">{orders.length} orders</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Action"].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(o => {
              const items = typeof o.items === "string" ? JSON.parse(o.items) : (o.items || []);
              return (
                <tr key={o.id} className="hover:bg-orange-50/30 transition">
                  <td className="px-5 py-3.5 font-bold text-gray-800">#{o.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-800 text-xs">{o.user_name}</p>
                    <p className="text-gray-400 text-xs">{o.user_email}</p>
                  </td>
                  <td className="px-5 py-3.5 max-w-[180px]">
                    {items.map((item, i) => (
                      <p key={i} className="text-xs text-gray-600 truncate">{item.title} ({item.weight} ×{item.quantity})</p>
                    ))}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-orange-500">₹{parseFloat(o.total_amount).toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusStyle[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">
                    {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={o.status}
                      onChange={e => statusMutation.mutate({ id: o.id, status: e.target.value })}
                      disabled={o.status === "cancelled" || o.status === "delivered"}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 cursor-pointer"
                    >
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
  );
}

// ── Offers Tab ───────────────────────────────────────────────
const EMPTY_OFFER = { title: "", subtitle: "", badge: "", bg_from: "#f97316", bg_to: "#f59e0b", emoji: "🎁", expires_at: "", is_active: true };

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
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-lg">
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
              {/* Preview */}
              <div className="rounded-2xl p-4 text-white flex items-center gap-3" style={{background:`linear-gradient(135deg,${form.bg_from},${form.bg_to})`}}>
                <span className="text-3xl">{form.emoji}</span>
                <div>
                  {form.badge && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">{form.badge}</span>}
                  <p className="font-extrabold">{form.title || "Offer Title"}</p>
                  {form.subtitle && <p className="text-white/80 text-xs">{form.subtitle}</p>}
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
    <div className="min-h-screen bg-amber-50 py-8 px-4">
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
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${tab === t ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm" : "text-gray-500 hover:text-orange-500"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "Overview" && <Overview />}
        {tab === "Orders" && <Orders />}
        {tab === "Offers" && <Offers />}
        {tab === "Users" && <Users />}
        {tab === "Products" && <Products />}
      </div>
    </div>
  );
}
