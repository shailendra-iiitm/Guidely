import React, { useEffect, useState } from "react";
import { Card, Progress, Badge, Timeline, Spin, Alert, message } from "antd";
import { TrophyOutlined, ClockCircleOutlined, BookOutlined } from "@ant-design/icons";
import learningProgressAPI from "../../apiManger/learningProgress";

const LearningProgress = () => {
  const [learningStats, setLearningStats] = useState({
    sessionsCompleted: 0,
    totalHours: 0,
    skillsLearned: 0,
    dayStreak: 0,
    averageRating: 0,
    totalSpent: 0
  });
  const [skillProgress, setSkillProgress] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLearningProgress();
  }, []);

  const fetchLearningProgress = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await learningProgressAPI.getLearningProgress();
      const progressData = response.data.data;
      
      setLearningStats(progressData.stats);
      setSkillProgress(progressData.skillProgress || []);
      setRecentActivity(progressData.recentActivity || []);
      setAchievements(progressData.achievements || []);
      
    } catch (error) {
      console.error("Error fetching learning progress:", error);
      setError("Failed to load learning progress. Please try again.");
      message.error("Failed to load learning progress");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={
          <button 
            onClick={fetchLearningProgress}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Learning Progress</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <div className="flex flex-col items-center">
            <BookOutlined className="text-3xl text-blue-500 mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{learningStats.sessionsCompleted}</h3>
            <p className="text-gray-600">Sessions Completed</p>
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="flex flex-col items-center">
            <ClockCircleOutlined className="text-3xl text-green-500 mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{learningStats.totalHours}</h3>
            <p className="text-gray-600">Total Hours</p>
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="flex flex-col items-center">
            <TrophyOutlined className="text-3xl text-yellow-500 mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{learningStats.skillsLearned}</h3>
            <p className="text-gray-600">Skills Learned</p>
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="flex flex-col items-center">
            <div className="text-3xl text-red-500 mb-2">🔥</div>
            <h3 className="text-2xl font-bold text-gray-800">{learningStats.dayStreak}</h3>
            <p className="text-gray-600">Day Streak</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Progress */}
        <Card title="Skill Progress" className="h-fit">
          <div className="space-y-4">
            {skillProgress.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{item.skill}</span>
                  <Badge 
                    color={item.level === 'Advanced' ? 'green' : item.level === 'Intermediate' ? 'blue' : 'orange'} 
                    text={item.level} 
                  />
                </div>
                <Progress 
                  percent={item.progress} 
                  strokeColor={item.level === 'Advanced' ? '#52c41a' : item.level === 'Intermediate' ? '#1890ff' : '#fa8c16'}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Sessions */}
        <Card title="Recent Sessions" className="h-fit">
          <Timeline>
            {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
              <Timeline.Item
                key={index}
                color="green"
              >
                <div className="pb-2">
                  <h4 className="font-medium">{activity.service || "Session"}</h4>
                  <p className="text-sm text-gray-600">
                    with {activity.guide} • {activity.duration || 60} mins
                  </p>
                  <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                  {activity.rating && (
                    <div className="mt-1">
                      <span className="text-xs text-yellow-600">
                        ★★★★★ {activity.rating}/5
                      </span>
                    </div>
                  )}
                </div>
              </Timeline.Item>
            )) : (
              <p className="text-gray-500 text-center py-4">No recent sessions found</p>
            )}
          </Timeline>
        </Card>
      </div>

      {/* Achievements */}
      <Card title="Achievements" className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.length > 0 ? achievements.map((achievement, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg border-2 border-yellow-300 bg-yellow-50 transition-all"
            >
              <div className="flex items-center mb-2">
                <div className="text-2xl mr-3">
                  {achievement.icon === 'trophy' ? '🏆' : '🎯'}
                </div>
                <h4 className="font-medium text-yellow-700">
                  {achievement.title}
                </h4>
              </div>
              <p className="text-sm text-yellow-600">
                {achievement.description}
              </p>
              <Badge status="success" text={`Earned on ${new Date(achievement.earnedAt).toLocaleDateString()}`} className="mt-2" />
            </div>
          )) : (
            <p className="text-gray-500 text-center py-4 col-span-full">No achievements earned yet. Complete more sessions to unlock achievements!</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LearningProgress;
