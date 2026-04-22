import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        console.error(error);
        setUsers([]);
        return;
      }

      setUsers(data || []);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Customers</h1>

      {users.map((u) => (
        <div key={u.id} className="p-3 bg-white mb-2 shadow">
          {u.email} - {u.role}
        </div>
      ))}
    </div>
  );
};

export default AdminCustomers;
