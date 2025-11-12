// frontend/src/utils/trackActivity.js
import axios from 'axios'; // Assuming axios is installed for API requests

export const trackActivity = async (eventType, details = {}) => {
  try {
    // Get userId from AuthContext if available (assuming AuthContext is implemented)
    const userId = localStorage.getItem('userId') || null; // Or use context: useAuth().user._id

    // Send POST request to backend
    await axios.post('/api/activity', {
      userId,
      eventType,
      details,
    });
    console.log(`Activity tracked: ${eventType}`);
  } catch (error) {
    console.error('Failed to track activity:', error);
  }
};