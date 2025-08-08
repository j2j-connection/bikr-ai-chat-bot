// Standalone entities (no Base44 dependency)

// Simple ChatSession implementation using localStorage
export const ChatSession = {
  create: async (sessionData) => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session = {
      id,
      ...sessionData,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    
    // Store in localStorage
    const sessions = JSON.parse(localStorage.getItem('bikebot_sessions') || '[]');
    sessions.push(session);
    localStorage.setItem('bikebot_sessions', JSON.stringify(sessions));
    
    return session;
  },

  update: async (id, updateData) => {
    const sessions = JSON.parse(localStorage.getItem('bikebot_sessions') || '[]');
    const sessionIndex = sessions.findIndex(s => s.id === id);
    
    if (sessionIndex >= 0) {
      sessions[sessionIndex] = {
        ...sessions[sessionIndex],
        ...updateData,
        updated_date: new Date().toISOString()
      };
      localStorage.setItem('bikebot_sessions', JSON.stringify(sessions));
      return sessions[sessionIndex];
    }
    
    throw new Error(`Session ${id} not found`);
  },

  list: async (sortBy = '-created_date', limit = 50) => {
    const sessions = JSON.parse(localStorage.getItem('bikebot_sessions') || '[]');
    
    // Simple sorting (descending by created_date)
    sessions.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    
    return sessions.slice(0, limit);
  },

  get: async (id) => {
    const sessions = JSON.parse(localStorage.getItem('bikebot_sessions') || '[]');
    return sessions.find(s => s.id === id) || null;
  }
};

// Simple User auth mock (not needed for standalone app)
export const User = {
  getCurrentUser: () => null,
  isAuthenticated: () => false
};