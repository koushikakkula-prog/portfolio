import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [activeDoc, setActiveDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadProjects = async () => {
    setLoading(true);
    const data = await api.getProjects();
    setProjects(data);
    if (data && data.length > 0 && !activeProject) {
      setActiveProject(data[0]);
      loadProjectDoc(data[0].id);
    }
    setLoading(false);
  };

  const loadProjectDoc = async (projectId) => {
    const doc = await api.getDocumentation(projectId);
    if (doc) {
      setActiveDoc(doc);
    }
  };

  const selectProject = (project) => {
    setActiveProject(project);
    loadProjectDoc(project.id);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProject,
      activeDoc,
      setActiveDoc,
      loading,
      notification,
      showNotification,
      loadProjects,
      selectProject,
      loadProjectDoc
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
