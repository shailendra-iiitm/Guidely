import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Input, message, Modal, Select, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { BASE_URL } from '../../const/env.const';

const { Option } = Select;

const SkillsManagement = () => {
  const [userSkills, setUserSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('Please login to manage skills');
        return;
      }

      // Fetch user's current skills and available skills
      const [userResponse, availableResponse] = await Promise.all([
        fetch(`${BASE_URL}/user/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${BASE_URL}/user/skills`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserSkills(userData.user?.profile?.tags || []);
      }

      if (availableResponse.ok) {
        const skillsData = await availableResponse.json();
        setAvailableSkills(skillsData.data?.skills || []);
      }
    } catch (error) {
      console.error('Error fetching skills data:', error);
      message.error('Failed to load skills data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkills = async () => {
    try {
      if (selectedSkills.length === 0 && !newSkill.trim()) {
        message.warning('Please select skills or add a new skill');
        return;
      }

      const token = localStorage.getItem('token');
      const skillsToAdd = [...selectedSkills];
      
      if (newSkill.trim()) {
        skillsToAdd.push(newSkill.trim());
      }

      const response = await fetch(`${BASE_URL}/user/skills`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skills: skillsToAdd })
      });

      if (response.ok) {
        const result = await response.json();
        setUserSkills(result.data.skills);
        setAddModalVisible(false);
        setSelectedSkills([]);
        setNewSkill('');
        message.success('Skills added successfully!');
        
        // Refresh available skills list
        fetchData();
      } else {
        const error = await response.json();
        message.error(error.message || 'Failed to add skills');
      }
    } catch (error) {
      console.error('Error adding skills:', error);
      message.error('Failed to add skills');
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    try {
      const token = localStorage.getItem('token');
      const updatedSkills = userSkills.filter(skill => skill !== skillToRemove);

      const response = await fetch(`${BASE_URL}/user/skills`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skills: updatedSkills })
      });

      if (response.ok) {
        const result = await response.json();
        setUserSkills(result.data.skills);
        message.success('Skill removed successfully!');
      } else {
        const error = await response.json();
        message.error(error.message || 'Failed to remove skill');
      }
    } catch (error) {
      console.error('Error removing skill:', error);
      message.error('Failed to remove skill');
    }
  };

  const availableSkillsForSelection = availableSkills.filter(skill => 
    !userSkills.includes(skill)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Skills Management</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setAddModalVisible(true)}
        >
          Add Skills
        </Button>
      </div>

      <Card title="Your Skills" className="mb-6">
        <div className="space-y-4">
          {userSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userSkills.map((skill, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveSkill(skill)}
                  color="blue"
                  className="mb-2 px-3 py-1 text-sm"
                >
                  {skill}
                </Tag>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg">No skills added yet</p>
              <p className="text-sm">Add skills to showcase your expertise to learners</p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Skills Categories" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Programming</h4>
            <div className="flex flex-wrap gap-1">
              {availableSkills.filter(skill => 
                skill.toLowerCase().includes('programming') || 
                skill.includes('C++') || 
                skill.includes('MONGODB') ||
                skill.includes('MERN')
              ).slice(0, 4).map(skill => (
                <Tag key={skill} size="small">{skill}</Tag>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-700 mb-2">Electronics & VLSI</h4>
            <div className="flex flex-wrap gap-1">
              {availableSkills.filter(skill => 
                skill.toLowerCase().includes('electronics') || 
                skill.toLowerCase().includes('vlsi') ||
                skill.toLowerCase().includes('vhdl') ||
                skill.toLowerCase().includes('circuit')
              ).slice(0, 4).map(skill => (
                <Tag key={skill} size="small">{skill}</Tag>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-700 mb-2">Career & Guidance</h4>
            <div className="flex flex-wrap gap-1">
              {availableSkills.filter(skill => 
                skill.toLowerCase().includes('career') || 
                skill.toLowerCase().includes('guidance') ||
                skill.toLowerCase().includes('resume')
              ).slice(0, 4).map(skill => (
                <Tag key={skill} size="small">{skill}</Tag>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Modal
        title="Add Skills"
        open={addModalVisible}
        onOk={handleAddSkills}
        onCancel={() => {
          setAddModalVisible(false);
          setSelectedSkills([]);
          setNewSkill('');
        }}
        okText="Add Skills"
        cancelText="Cancel"
        width={600}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select from existing skills:
            </label>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select skills from the list"
              value={selectedSkills}
              onChange={setSelectedSkills}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {availableSkillsForSelection.map(skill => (
                <Option key={skill} value={skill}>
                  {skill}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or add a new skill:
            </label>
            <Input
              placeholder="Enter a new skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onPressEnter={handleAddSkills}
            />
          </div>

          <div className="text-xs text-gray-500">
            <p>• Select multiple skills from the existing list</p>
            <p>• Add a new skill if it's not in the list</p>
            <p>• Skills help learners find you more easily</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SkillsManagement;
