import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, X, DollarSign, Tag } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from './api';
import './index.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    console.log("Using API Base URL:", "http://127.0.0.1:12345/api");
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ name: product.name, description: product.description || '', price: product.price });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      console.error("Failed to save product", err);
      const message = err.response ?
        (err.response.data?.message || JSON.stringify(err.response.data)) :
        (err.message || "Network Error or CORS issue");
      alert("Error: " + message + "\n\nDetails: " + (err.config?.url || "No URL"));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error("Failed to delete product", err);
      }
    }
  };

  return (
    <div className="app-container">
      <div className="header animate-fade-in">
        <h1>Product Inventory</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your beautiful catalog</p>
      </div>

      <div className="flex-between animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>All Products</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p>Loading catalog...</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.length === 0 ? (
            <div className="empty-state glass-panel">
              <Package />
              <h3>No products found</h3>
              <p>Add your first product to get started.</p>
            </div>
          ) : (
            products.map((p, index) => (
              <div
                className="product-card glass-panel animate-fade-in"
                key={p.id}
                style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
              >
                <div className="product-header">
                  <h3 className="product-title">
                    <Tag size={16} style={{ display: 'inline', marginRight: '6px', color: '#818cf8', verticalAlign: 'text-bottom' }} />
                    {p.name}
                  </h3>
                  <span className="product-price">${parseFloat(p.price).toFixed(2)}</span>
                </div>
                <p className="product-desc">{p.description || "No description provided."}</p>
                <div className="product-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => openModal(p)}>
                    <Edit2 size={14} /> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-between" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button
                onClick={closeModal}
                className="btn btn-secondary"
                style={{ padding: '6px', borderRadius: '50%', display: 'flex' }}
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Premium Headphones"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details about the product..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    style={{ paddingLeft: '35px' }}
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex-gap" style={{ marginTop: '25px' }}>
                <button type="button" className="btn btn-secondary w-full" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-full">
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
