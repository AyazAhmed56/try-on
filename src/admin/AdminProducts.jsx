import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("outfits").select("*");

      if (error) {
        console.error(error);
        return;
      }

      setProducts(data || []);
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">All Products</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Seller</th>
          </tr>
        </thead>

        <tbody>
          {(products || []).map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.seller_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
