import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'

function App() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const userId = 1; // Static user ID

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/products/${userId}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          product_name: productName,
          quantity: parseInt(quantity),
          price: parseFloat(price),
        }),
      });
      setProductName("");
      setQuantity("");
      setPrice("");
      toast.success("Product Added Successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });
      toast.success("Product Deleted Successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products
    .filter((p) => p.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortField === "quantity") return a.quantity - b.quantity;
      if (sortField === "price") return a.price - b.price;
      return 0;
    });

  const totalInventoryValue = products.reduce(
    (acc, p) => acc + p.quantity * p.price,
    0
  );
  const InventoryCheck=()=>{
    alert(` total invetory  : ₹  ${totalInventoryValue}`);
  }

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>

      <form onSubmit={handleAddProduct} className="mb-6">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="border p-2 w-1/3"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border p-2 w-1/3"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 w-1/3"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </form>

  
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Product"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-1/2"
        />
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="border p-2"
        >
          <option value="">Sort By</option>
          <option value="quantity">Quantity</option>
          <option value="price">Price</option>
        </select>
      </div>

     
      {filteredProducts.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table className="w-full border mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Total Value</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className={p.quantity < 5 ? "bg-yellow-100" : ""}>
                <td className="p-2 border">{p.product_name}</td>
                <td className="p-2 border">{p.quantity}</td>
                <td className="p-2 border">₹ {p.price}</td>
                <td className="p-2 border">₹ {(p.price * p.quantity).toFixed(2)}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={InventoryCheck}  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" >Total Inventory</button>

     
      <ToastContainer />
    </div>
  );
}

export default App;
