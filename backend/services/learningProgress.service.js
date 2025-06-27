// backend/services/learningProgress.service.js

const BookingModel = require("../models/booking.model");
const UserModel = require("../models/user.model");

/**
 * Calculate learning progress statistics for a user
 */
const calculateLearningProgress = async (userId) => {
  try {
    console.log("Calculating learning progress for user:", userId);

    // Get all completed bookings for the user
    const completedBookings = await BookingModel.find({
      user: userId,
      status: 'completed'
    })
    .populate('service', 'name description duration category skillLevel')
    .populate('guide', 'name')
    .sort({ dateAndTime: -1 });

    const totalSessions = completedBookings.length;
    
    // Calculate total hours
    const totalHours = completedBookings.reduce((total, booking) => {
      const duration = booking.service?.duration || 60; // Default 60 minutes
      return total + (duration / 60); // Convert to hours
    }, 0);

    // Calculate unique skills learned (based on service categories)
    const skillsSet = new Set();
    const skillProgress = {};
    
    completedBookings.forEach(booking => {
      if (booking.service?.category) {
        skillsSet.add(booking.service.category);
        
        // Track skill progress
        if (!skillProgress[booking.service.category]) {
          skillProgress[booking.service.category] = {
            sessions: 0,
            totalHours: 0,
            levels: new Set(),
            latestLevel: 'Beginner'
          };
        }
        
        skillProgress[booking.service.category].sessions++;
        skillProgress[booking.service.category].totalHours += (booking.service?.duration || 60) / 60;
        
        if (booking.service?.skillLevel) {
          skillProgress[booking.service.category].levels.add(booking.service.skillLevel);
          skillProgress[booking.service.category].latestLevel = booking.service.skillLevel;
        }
      }
    });

    const skillsLearned = skillsSet.size;

    // Calculate learning streak
    const streak = await calculateLearningStreak(userId);

    // Calculate skill progress percentages
    const skillProgressArray = Object.entries(skillProgress).map(([skill, data]) => {
      let progressPercentage = Math.min((data.sessions * 15), 100); // 15% per session, max 100%
      let level = 'Beginner';
      
      // Determine level based on sessions and progress
      if (data.sessions >= 8 || progressPercentage >= 80) {
        level = 'Advanced';
        progressPercentage = Math.min(progressPercentage, 100);
      } else if (data.sessions >= 4 || progressPercentage >= 50) {
        level = 'Intermediate';
      }
      
      // Use actual latest level if available
      if (data.latestLevel) {
        level = data.latestLevel;
      }

      return {
        skill,
        progress: Math.round(progressPercentage),
        level,
        sessions: data.sessions,
        totalHours: Math.round(data.totalHours * 10) / 10
      };
    });

    // Get recent sessions (last 5)
    const recentSessions = completedBookings.slice(0, 5).map(booking => ({
      id: booking._id,
      title: booking.service?.name || 'Session',
      guide: booking.guide?.name || 'Unknown Guide',
      date: booking.dateAndTime.toISOString().split('T')[0],
      duration: `${(booking.service?.duration || 60) / 60} hours`,
      status: booking.status,
      rating: booking.rating?.score || null
    }));

    // Calculate achievements automatically
    const achievements = await calculateAchievements(userId, {
      totalSessions,
      skillsLearned,
      streak,
      skillProgress: skillProgressArray
    });

    return {
      stats: {
        totalSessions,
        completedSessions: totalSessions,
        totalHours: Math.round(totalHours * 10) / 10,
        skillsLearned,
        currentStreak: streak
      },
      skillProgress: skillProgressArray,
      recentSessions,
      achievements
    };

  } catch (error) {
    console.error("Error calculating learning progress:", error);
    throw error;
  }
};

/**
 * Calculate learning streak based on session completion dates
 */
const calculateLearningStreak = async (userId) => {
  try {
    const completedBookings = await BookingModel.find({
      user: userId,
      status: 'completed'
    })
    .select('dateAndTime')
    .sort({ dateAndTime: -1 });

    if (completedBookings.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get unique days when sessions were completed
    const sessionDays = [...new Set(
      completedBookings.map(booking => {
        const date = new Date(booking.dateAndTime);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    )].sort((a, b) => b - a); // Sort descending

    // Check for consecutive days
    let expectedDate = currentDate.getTime();
    
    for (const sessionDay of sessionDays) {
      if (sessionDay === expectedDate) {
        streak++;
        expectedDate -= 24 * 60 * 60 * 1000; // Go back one day
      } else if (sessionDay === expectedDate + 24 * 60 * 60 * 1000) {
        // Session was today, continue streak
        streak++;
        expectedDate -= 24 * 60 * 60 * 1000;
      } else {
        break; // Streak broken
      }
    }

    return streak;
  } catch (error) {
    console.error("Error calculating learning streak:", error);
    return 0;
  }
};

/**
 * Calculate achievements based on user progress
 */
const calculateAchievements = async (userId, progressData) => {
  try {
    const user = await UserModel.findById(userId);
    const earnedAchievements = user?.profile?.achievements || [];
    
    const possibleAchievements = [
      {
        title: "First Session",
        description: "Completed your first learning session",
        earned: progressData.totalSessions >= 1,
        category: "session",
        icon: "trophy"
      },
      {
        title: "Week Warrior", 
        description: "Completed 5 sessions in a week",
        earned: progressData.totalSessions >= 5,
        category: "session",
        icon: "trophy"
      },
      {
        title: "Streak Master",
        description: "Maintained a 7-day learning streak", 
        earned: progressData.currentStreak >= 7,
        category: "streak",
        icon: "fire"
      },
      {
        title: "Skill Explorer",
        description: "Learned 3 different skills",
        earned: progressData.skillsLearned >= 3,
        category: "skill",
        icon: "star"
      },
      {
        title: "Expert Level",
        description: "Reach advanced level in any skill",
        earned: progressData.skillProgress.some(skill => skill.level === 'Advanced'),
        category: "skill", 
        icon: "crown"
      }
    ];

    return possibleAchievements;
  } catch (error) {
    console.error("Error calculating achievements:", error);
    return [];
  }
};

module.exports = {
  calculateLearningProgress,
  calculateLearningStreak,
  calculateAchievements
};
