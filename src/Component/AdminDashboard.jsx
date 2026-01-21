import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tag,
  LogOut,
  ShoppingCart,
  AlertCircle,
  User,
} from "lucide-react";
import { Modal, Button } from "../components/ui/SharedComponents";

// Import Sections
import AnalyticsTab from "../components/admin/AnalyticsTab";
import InventoryTab from "../components/admin/InventoryTab";
import OffersTab from "../components/admin/OffersTab";
import OrdersTab, { OrderDetailsContent } from "../components/admin/OrdersTab";
import { ProductForm } from "../components/forms/ProductForm";

import CustomersTab, {
  CustomerDetailsContent,
} from "../components/admin/CustomersTab";

// Import Data
import {
  initialProducts,
  initialCoupons,
  initialOrders,
  initialCustomers,
} from "../data/mockData";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [activeModal, setActiveModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [customers, setCustomers] = useState(initialCustomers);

  // State lifted to parent so modals can modify data
  const [products, setProducts] = useState(initialProducts);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [orders, setOrders] = useState(initialOrders);

  // Handlers
  const openModal = (type, item = null) => {
    setSelectedItem(item);
    setActiveModal(type);
  };
  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
  };

  const handleShipOrder = (orderId) => {
    const fakeAWB = "SR-" + Math.floor(Math.random() * 1000000000);
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: "Shipped", awb: fakeAWB }
          : order,
      ),
    );
    closeModal();
    alert(`Order ${orderId} pushed to Shiprocket! AWB Generated: ${fakeAWB}`);
  };

  return (
    <div className="flex h-screen bg-[#F8F9FC] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              J
            </div>
            <span className="font-bold text-lg tracking-tight">MyStore</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "analytics", icon: LayoutDashboard },
            { id: "inventory", icon: Package },
            { id: "orders", icon: ShoppingCart },
            { id: "customers", icon: User },
            { id: "offers", icon: Tag },
            { id: "logout", icon: LogOut },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === item.id ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 translate-x-1" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <item.icon className="w-5 h-5" />{" "}
              <span className="capitalize">{item.id}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-xl font-bold capitalize text-slate-800">
            {activeTab}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">Admin</span>
            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <span className="text-sm font-bold text-slate-600">A</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "inventory" && (
            <InventoryTab products={products} openModal={openModal} />
          )}
          {activeTab === "offers" && (
            <OffersTab
              coupons={coupons}
              setCoupons={setCoupons}
              openModal={openModal}
            />
          )}
          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              setOrders={setOrders}
              openModal={openModal}
            />
          )}

          {activeTab === "customers" && (
            <CustomersTab
            customers={customers}
            setCustomers={setCustomers}
            openModal={openModal}
            />
          )}

          {activeTab === "logout" && (
            <div className="text-center text-slate-500">Logging out...</div>
          )}
        </div>
      </main>

      {/* --- MODALS (Kept in Parent to control global overlay) --- */}

      <Modal
        isOpen={activeModal === "add" || activeModal === "edit"}
        onClose={closeModal}
        title={activeModal === "edit" ? "Edit Product" : "Add New Product"}
      >
        <ProductForm
          isEdit={activeModal === "edit"}
          product={selectedItem}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        isOpen={activeModal === "order"}
        onClose={closeModal}
        title="Order Details"
      >
        {selectedItem && (
          <OrderDetailsContent
            order={selectedItem}
            handleShipOrder={handleShipOrder}
          />
        )}
      </Modal>

      <Modal
        isOpen={activeModal === "delete"}
        onClose={closeModal}
        title="Delete Product"
        maxWidth="max-w-sm"
      >
        <div className="text-center pt-2">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-slate-600 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-bold text-slate-900">
              {selectedItem?.name}
            </span>
            ?
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={closeModal} className="w-full">
              Cancel
            </Button>
            <Button variant="danger" className="w-full">
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Coupon Modal (Simplified for brevity) */}
      <Modal
        isOpen={activeModal === "coupon"}
        onClose={closeModal}
        title="Create New Coupon"
      >
        {/* 1. Coupon Code Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 uppercase">
            Coupon Code
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. SUMMER25"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-mono uppercase"
            />
          </div>
          <p className="text-[10px] text-slate-400">
            Customers will enter this code at checkout.
          </p>
        </div>

        {/* 2. Discount Type Selection */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-slate-500 uppercase">
            Discount Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="relative flex cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm focus:outline-none hover:border-slate-300">
              <input
                type="radio"
                name="discount-type"
                className="sr-only"
                defaultChecked
              />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className="block text-sm font-medium text-slate-900">
                    Percentage
                  </span>
                  <span className="mt-1 flex items-center text-xs text-slate-500">
                    % Off the total bill
                  </span>
                </span>
              </span>
              <div className="absolute top-4 right-4 h-4 w-4 rounded-full border border-slate-300 bg-white checked:border-slate-900 checked:bg-slate-900" />
            </label>

            <label className="relative flex cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm focus:outline-none hover:border-slate-300">
              <input type="radio" name="discount-type" className="sr-only" />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className="block text-sm font-medium text-slate-900">
                    Fixed Amount
                  </span>
                  <span className="mt-1 flex items-center text-xs text-slate-500">
                    Flat ₹ discount
                  </span>
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* 3. Value & Minimum Spend Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase">
              Discount Value
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="20"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase">
              Min. Purchase (₹)
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="1000"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 4. Expiration Date */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 uppercase">
            Expiration Date (Optional)
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-600"
          />
        </div>
      </Modal>


      <Modal isOpen={activeModal === "customer"} onClose={closeModal} title="Customer Profile">
  {selectedItem && <CustomerDetailsContent customer={selectedItem} />}
</Modal>
    </div>
  );
}
