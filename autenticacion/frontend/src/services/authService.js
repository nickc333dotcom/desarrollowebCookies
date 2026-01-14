const API_URL = '/api/auth';

export const authService = {
  register: async (email, password, name) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
      credentials: 'include' 
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al registrar usuario');
    }

    const data = await response.json();
    
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  // Iniciar sesión
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include' 
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al iniciar sesión');
    }

    const data = await response.json();
    
    // Solo guardamos la info del usuario para la UI, NO el token
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  // Cerrar sesión
  logout: async () => {

    await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Obtener usuario actual 
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado 
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },

  // Obtener perfil del servidor
  getProfile: async () => {
    const response = await fetch(`${API_URL}/me`, {
      credentials: 'include' 
    });

    if (!response.ok) {
      throw new Error('Error al obtener perfil');
    }

    return response.json();
  },

  // Hacer petición autenticada genérica
  fetchWithAuth: async (url, options = {}) => {
    const config = {
      ...options,
      credentials: 'include', /
      headers: {
        ...options.headers,
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch(url, config);
    
    if (response.status === 401) {
      await authService.logout();
      throw new Error('Sesión expirada');
    }

    return response;
  }
};