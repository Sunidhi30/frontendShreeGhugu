

"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

export default function VendorPackageCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    revenueType: "",
    viewThreshold: 0,
    price: 0,
    rentalDuration: 0,
    vendor_id: "",
  });
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:9000/api/vendors/get-packages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPackages(response.data || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:9000/api/vendors/create-packages",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPackages((prev) => [response.data, ...prev]);
      closeModal();
      setFormData({
        name: "",
        description: "",
        revenueType: "",
        viewThreshold: 0,
        price: 0,
        rentalDuration: 0,
        vendor_id: "",
      });
    } catch (error) {
      console.error("Error saving package", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      alert("Failed to create package. Check console for details.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="p-6 rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-start">
          <div className="w-full lg:w-3/5">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Vendor Packages</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Below is the list of your existing packages.
            </p>
            <div className="mt-4 space-y-3">
              {/* {Array.isArray(packages) && packages.length > 0 ? (
                packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800"
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {pkg.revenueType} | ${pkg.price}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No packages available.</p>
              )} */}
              {Array.isArray(packages) && packages.length > 0 ? (
  packages.map((pkg) => (
    <div
      key={pkg._id}
      className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800"
    >
      <h3 className="font-semibold text-gray-800 dark:text-white">{pkg.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {pkg.description}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Revenue Type: {pkg.revenueType}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Price: ${pkg.price}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Rental Duration: {pkg.rentalDuration} days
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        View Threshold: {pkg.viewThreshold}
      </p>
    </div>
  ))
) : (
  <p className="text-gray-500 dark:text-gray-400">No packages available.</p>
)}

            </div>
          </div>

          <div className="lg:w-1/3 mt-4 lg:mt-0">
            <Button variant="default" size="lg" className="w-full" onClick={openModal}>
              + Create New Package
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-6 bg-white dark:bg-gray-900 rounded-3xl overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Create Package</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Fill out the form to create a new vendor package.
          </p>
          <form className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label>Description</Label>
              <Input type="text" name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div>
              <Label>Revenue Type</Label>
              <Input type="text" name="revenueType" value={formData.revenueType} onChange={handleChange} required />
            </div>
            <div>
              <Label>Price ($)</Label>
              <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div>
              <Label>Rental Duration (Days)</Label>
              <Input
                type="number"
                name="rentalDuration"
                value={formData.rentalDuration}
                onChange={handleChange}
              />
            </div>
          </form>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" size="sm" onClick={closeModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Package
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
