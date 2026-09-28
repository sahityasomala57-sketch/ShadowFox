import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const uploadDocument = async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
    });
};

export const getDocuments = async () => {
    return axios.get(`${API_URL}/documents`);
};

export const deleteDocument = async (id) => {
    return axios.delete(`${API_URL}/documents/${id}`);
};

export const askQuestion = async (question) => {
    return axios.post(`${API_URL}/questions/ask`, { question });
};
