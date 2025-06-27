import React, { useEffect, useState } from "react";
import ServiceCard from "../../components/ServiceCard";
import serviceAPI from "../../apiManger/service"; // API naming: more generic for Guidely
import { Button, Input, Modal, Form, Spin, Switch, Typography, Divider } from "antd";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";

const { Text } = Typography;

const Services = () => {
  const [services, setServices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFreeService, setIsFreeService] = useState(false);
  const [form] = Form.useForm();

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
      // If free service is enabled, set price to 0
      const serviceData = {
        ...values,
        price: isFreeService ? 0 : values.price
      };
      
      const response = await serviceAPI.createService(serviceData);
      setServices((prev) => [...prev, response?.data?.service]);
      setIsModalVisible(false);
      form.resetFields();
      setIsFreeService(false);
      toast.success(`${isFreeService ? 'Free service' : 'Service'} created successfully!`);
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
      // If free service is enabled, set price to 0
      const serviceData = {
        ...values,
        price: isFreeService ? 0 : values.price
      };
      
      const response = await serviceAPI.editService(editingService._id, serviceData);
      setServices((prev) =>
        prev.map((srv) =>
          srv._id === editingService._id ? response.data.service : srv
        )
      );
      setIsModalVisible(false);
      setEditingService(null);
      form.resetFields();
      setIsFreeService(false);
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
    setIsFreeService(service.price === 0);
    setIsModalVisible(true);
    form.setFieldsValue(service);
  };

  const handleToggleStatus = async (serviceId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await serviceAPI.toggleServiceStatus(serviceId, newStatus);
      
      // Update the local state
      setServices((prevServices) =>
        prevServices.map((service) =>
          service._id === serviceId ? { ...service, active: newStatus } : service
        )
      );
      
      toast.success(`Service ${newStatus ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error("Error toggling service status:", error);
      toast.error("Failed to update service status.");
    }
  };

  return (
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
            form.resetFields();
            setIsFreeService(false);
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            onFinish={editingService ? handleEditService : handleCreateService}
            initialValues={editingService}
            layout="vertical"
          >
            <Form.Item
              label="Service Name"
              name="name"
              rules={[{ required: true, message: "Please enter the service name!" }]}
            >
              <Input placeholder="e.g., JavaScript Fundamentals, React Advanced, Career Guidance" />
            </Form.Item>
            
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter the service description!" }]}
            >
              <Input.TextArea 
                rows={3}
                placeholder="Describe what learners will get from this session..."
              />
            </Form.Item>
            
            <Form.Item
              label="Duration (minutes)"
              name="duration"
              rules={[{ required: true, message: "Please enter the service duration!" }]}
            >
              <Input 
                type="number" 
                placeholder="e.g., 30, 60, 90"
                addonAfter="minutes"
              />
            </Form.Item>

            {/* Free Service Toggle */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Text strong className="text-blue-800">Free Session</Text>
                  <br />
                  <Text className="text-sm text-blue-600">
                    Perfect for testing your platform or offering trial sessions
                  </Text>
                </div>
                <Switch
                  checked={isFreeService}
                  onChange={(checked) => {
                    setIsFreeService(checked);
                    if (checked) {
                      form.setFieldsValue({ price: 0 });
                    }
                  }}
                  checkedChildren="Free"
                  unCheckedChildren="Paid"
                />
              </div>
            </div>

            <Form.Item
              label="Price (₹)"
              name="price"
              rules={[
                { required: !isFreeService, message: "Please enter the service price!" },
                { 
                  validator: (_, value) => {
                    if (isFreeService) return Promise.resolve();
                    if (value && value > 0) return Promise.resolve();
                    return Promise.reject(new Error('Price must be greater than 0 for paid services'));
                  }
                }
              ]}
            >
              <Input 
                type="number" 
                placeholder={isFreeService ? "0" : "e.g., 500, 1000, 1500"}
                disabled={isFreeService}
                value={isFreeService ? 0 : undefined}
                addonBefore="₹"
                addonAfter={isFreeService ? "(Free)" : ""}
              />
            </Form.Item>

            {isFreeService && (
              <div className="mb-4 p-3 bg-green-50 rounded border border-green-200">
                <Text className="text-green-700 text-sm">
                  🎉 This will be a free session! Learners can book without any payment. 
                  Great for building reviews and testing your session flow.
                </Text>
              </div>
            )}

            <Divider />

            <div className="flex gap-2">
              <Button 
                type="primary" 
                htmlType="submit"
                className={isFreeService ? "bg-green-600 hover:bg-green-700 border-green-600" : ""}
              >
                {editingService 
                  ? "Save Changes" 
                  : isFreeService 
                    ? "Create Free Service" 
                    : "Create Service"
                }
              </Button>
              <Button 
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingService(null);
                  form.resetFields();
                  setIsFreeService(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal>
        <Spin spinning={loading}>
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {services?.map((srv) => (
              <ServiceCard
                key={srv._id}
                service={srv}
                onEdit={() => handleEdit(srv)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        </Spin>
      </div>
  );
};

export default Services;
