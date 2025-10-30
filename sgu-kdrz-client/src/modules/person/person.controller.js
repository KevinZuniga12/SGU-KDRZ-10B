const PersonController = {};
const ENV = import.meta.env;

const API_URL = `http://${ENV.VITE_API_HOST}:${ENV.VITE_API_PORT}${ENV.VITE_API_BASE}`;

/**
 * Obtener todas las personas
 */
PersonController.getAll = async () => {
    try {
        const response = await fetch(`${API_URL}/persons`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al obtener personas:', error);
        throw error;
    }
}

/**
 * Obtener una persona por ID
 */
PersonController.getById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/persons/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al obtener persona:', error);
        throw error;
    }
}

/**
 * Crear una nueva persona
 */
PersonController.create = async (personData) => {
    try {
        const response = await fetch(`${API_URL}/persons`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(personData)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al crear persona:', error);
        throw error;
    }
}

/**
 * Actualizar una persona existente
 */
PersonController.update = async (id, personData) => {
    try {
        const response = await fetch(`${API_URL}/persons/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(personData)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al actualizar persona:', error);
        throw error;
    }
}

/**
 * Eliminar una persona
 */
PersonController.delete = async (id) => {
    try {
        const response = await fetch(`${API_URL}/persons/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al eliminar persona:', error);
        throw error;
    }
}

export default PersonController;
