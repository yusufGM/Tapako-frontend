import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function Orders() {
  const [date, setDate] = useState("");
  const orders = [
    { id: 1, customer: "Budi", total: "$120", date: "2025-10-01" },
    { id: 2, customer: "Ari", total: "$80", date: "2025-10-02" },
    { id: 3, customer: "Sinta", total: "$200", date: "2025-09-29" },
  ];

  const filtered = date ? orders.filter((o) => o.date === date) : orders;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded mb-4"
      />
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">ID</th>
            <th className="text-left p-2">Customer</th>
            <th className="text-left p-2">Total</th>
            <th className="text-left p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
            <tr key={o.id} className="border-b">
              <td className="p-2">{o.id}</td>
              <td className="p-2">{o.customer}</td>
              <td className="p-2">{o.total}</td>
              <td className="p-2">{o.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
