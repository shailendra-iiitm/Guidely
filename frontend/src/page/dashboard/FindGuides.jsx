import React, { useState, useEffect } from "react";
import { Card, Button, Input, Select, Spin, Empty, Alert, message } from "antd";
import { SearchOutlined, StarFilled, ExclamationCircleOutlined, EyeOutlined, LinkedinOutlined, TwitterOutlined, GithubOutlined, GlobalOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import guideAPI from "../../apiManger/guide";

const { Option } = Select;

const FindGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await guideAPI.getAllGuides();
        const allGuides = response?.data?.guides || [];
        
        // Transform API data to match our component structure
        const transformedGuides = allGuides.map((guide, index) => ({
          id: guide._id || guide.id || index + 1,
          name: guide.name || "Unknown Guide",
          username: guide.username || guide.name?.toLowerCase().replace(' ', ''),
          skills: guide.skills || guide.profile?.tags || [], // Use real skills from backend
          rating: guide.averageRating, // Real rating from backend (can be null)
          sessions: guide.totalSessions || 0, // Real session count from backend
          hourlyRate: guide.hourlyRate || 0, // Real calculated hourly rate from services
          bio: guide.profile?.bio || guide.bio || "Professional guide ready to help you learn.",
          profileImage: guide.photoUrl || guide.profileImage || `https://ui-avatars.com/api?name=${guide.name || 'Guide'}`,
          availability: guide.availability || "Unknown", // Real availability status
          servicesCount: guide.servicesCount || 0,
          title: guide.profile?.title || "",
          profile: guide.profile || {} // Include the full profile object for social links
        }));
        
        setGuides(transformedGuides);
      } catch (error) {
        console.error("Error fetching guides:", error);
        setError("Failed to load guides. Please try again later.");
        message.error("Failed to load guides. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSkill = !skillFilter || guide.skills.some(skill => 
      skill.toLowerCase().includes(skillFilter.toLowerCase())
    );
    return matchesSearch && matchesSkill;
  });

  const handleBookSession = (guide) => {
    // Navigate to guide's profile page where user can see services and book
    const username = guide.username || guide.name.toLowerCase().replace(' ', '');
    navigate(`/guide/${username}`);
  };

  const handleViewProfile = (guide) => {
    // Navigate to guide's full profile page
    const username = guide.username || guide.name.toLowerCase().replace(' ', '');
    navigate(`/guide/${username}`);
  };

  // Get all unique skills from all guides for filter dropdown
  const allSkills = [...new Set(guides.flatMap(guide => guide.skills))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Error Loading Guides"
          description={error}
          type="error"
          icon={<ExclamationCircleOutlined />}
          showIcon
          action={
            <Button size="small" danger onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Find Expert Guides</h2>
        
        {/* Search and Filter Controls */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search guides or skills..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            placeholder="Filter by skill"
            value={skillFilter}
            onChange={setSkillFilter}
            allowClear
            className="w-48"
          >
            {allSkills.map(skill => (
              <Option key={skill} value={skill}>{skill}</Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Guides Grid */}
      {filteredGuides.length === 0 ? (
        <Empty 
          description="No guides found matching your criteria"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Card
              key={guide.id}
              hoverable
              onClick={() => handleViewProfile(guide)}
              cover={
                <div className="flex justify-center items-center pt-6 pb-2 bg-gradient-to-b from-gray-50 to-white">
                  <img
                    alt={guide.name}
                    src={guide.profileImage}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                  />
                </div>
              }
              actions={[
                <div key="actions" className="flex gap-2 px-2">
                  <Button
                    type="default"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProfile(guide);
                    }}
                    className="flex-1"
                  >
                    View Profile
                  </Button>
                  <Button
                    type="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookSession(guide);
                    }}
                    disabled={guide.availability === "Busy" || guide.availability === "Unknown"}
                    className="flex-1"
                  >
                    {guide.availability === "Busy" 
                      ? "Busy" 
                      : guide.availability === "Unknown"
                      ? "Unknown"
                      : guide.servicesCount === 0
                      ? "No Services"
                      : "Book"}
                  </Button>
                </div>
              ]}
              className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl"
            >
              <div className="px-2">
                {/* Header with name and social links */}
                <div className="flex justify-between items-start mb-4">
                  <div className="text-center flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                      {guide.name}
                    </h3>
                    {guide.title && (
                      <p className="text-sm text-gray-500">{guide.title}</p>
                    )}
                    <div className="flex justify-center items-center gap-2 mt-2">
                      {guide.rating ? (
                        <>
                          <StarFilled className="text-yellow-400" />
                          <span className="text-sm">
                            {guide.rating.toFixed(1)} ({guide.sessions} sessions)
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">
                          {guide.sessions > 0 ? `${guide.sessions} sessions` : "New guide"}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Social Links on the right */}
                  <div className="flex flex-col gap-2 ml-3">
                    {guide.profile?.socialLinks?.linkedin && guide.profile.socialLinks.linkedin.trim() && (
                      <a
                        href={guide.profile.socialLinks.linkedin.startsWith('http') 
                          ? guide.profile.socialLinks.linkedin 
                          : `https://linkedin.com/in/${guide.profile.socialLinks.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:scale-110 transition-transform"
                        title="LinkedIn"
                      >
                        <LinkedinOutlined className="text-lg" />
                      </a>
                    )}
                    {guide.profile?.socialLinks?.github && guide.profile.socialLinks.github.trim() && (
                      <a
                        href={guide.profile.socialLinks.github.startsWith('http') 
                          ? guide.profile.socialLinks.github 
                          : `https://github.com/${guide.profile.socialLinks.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-800 hover:scale-110 transition-transform"
                        title="GitHub"
                      >
                        <GithubOutlined className="text-lg" />
                      </a>
                    )}
                    {guide.profile?.socialLinks?.Twitter && guide.profile.socialLinks.Twitter.trim() && (
                      <a
                        href={guide.profile.socialLinks.Twitter.startsWith('http') 
                          ? guide.profile.socialLinks.Twitter 
                          : `https://twitter.com/${guide.profile.socialLinks.Twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-400 hover:scale-110 transition-transform"
                        title="Twitter"
                      >
                        <TwitterOutlined className="text-lg" />
                      </a>
                    )}
                    {guide.profile?.socialLinks?.website && guide.profile.socialLinks.website.trim() && (
                      <a
                        href={guide.profile.socialLinks.website.startsWith('http') 
                          ? guide.profile.socialLinks.website 
                          : `https://${guide.profile.socialLinks.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-green-600 hover:scale-110 transition-transform"
                        title="Website"
                      >
                        <GlobalOutlined className="text-lg" />
                      </a>
                    )}
                  </div>
                </div>
                
                {guide.bio && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guide.bio}</p>
                )}
                
                {guide.skills.length > 0 ? (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {guide.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {guide.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{guide.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <span className="text-sm text-gray-500 italic">No skills specified</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  {guide.hourlyRate > 0 ? (
                    <span className="text-lg font-bold text-green-600">
                      ₹{guide.hourlyRate}/hour
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {guide.servicesCount > 0 ? "Pricing varies" : "No services yet"}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    guide.availability === "Available" 
                      ? "bg-green-100 text-green-700" 
                      : guide.availability === "Busy"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {guide.availability}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindGuides;
