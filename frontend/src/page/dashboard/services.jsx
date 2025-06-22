import React, { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import ServiceCard from "../../components/ServiceCard";
import serviceAPI from "../../apiManger/service"; // API naming: more generic for Guidely
import { Button, Input, Modal, Form, Spin } from "antd";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";

const Services = () => {
  const [services, setServices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await serviceAPI.getAllServices();
        setServices(response?.data?.services);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleCreateService = async (values) => {
    setLoading(true);
    try {
      const response = await serviceAPI.createService(values);
      setServices((prev) => [...prev, response?.data?.service]);
      setIsModalVisible(false);
      toast.success("Service created successfully!");
    } catch (err) {
      console.error("Error creating service:", err);
      toast.error("Failed to create service.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = async (values) => {
    setLoading(true);
    try {
      const response = await serviceAPI.editService(editingService._id, values);
      setServices((prev) =>
        prev.map((srv) =>
          srv._id === editingService._id ? response.data.service : srv
        )
      );
      setIsModalVisible(false);
      setEditingService(null);
      toast.success("Service updated successfully!");
    } catch (err) {
      console.error("Error editing service:", err);
      toast.error("Failed to update service.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setIsModalVisible(true);
  };

  return (
    <Dashboard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Services</h2>
          <Button
            className="!rounded"
            type="primary"
            onClick={() => setIsModalVisible(true)}
          >
            <FiPlus className="inline-block mr-2" /> Add New
          </Button>
        </div>
        <Modal
          title={editingService ? "Edit Service" : "Create New Service"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingService(null);
          }}
          footer={null}
        >
          <Form
            onFinish={editingService ? handleEditService : handleCreateService}
            initialValues={editingService}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter the service name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter the service description!" }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Duration (minutes)"
              name="duration"
              rules={[{ required: true, message: "Please enter the service duration!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Price (₹)"
              name="price"
              rules={[{ required: true, message: "Please enter the service price!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              {editingService ? "Save Changes" : "Create Service"}
            </Button>
          </Form>
        </Modal>
        <Spin spinning={loading}>
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {services?.map((srv) => (
              <ServiceCard
                key={srv._id}
                service={srv}
                onEdit={() => handleEdit(srv)}
              />
            ))}
          </div>
        </Spin>
      </div>
    </Dashboard>
  );
};

export default Services;
