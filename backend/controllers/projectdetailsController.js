const ProjectDetails = require("../models/Projectdetails");

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { projectName, description, startDate, endDate, status } = req.body;
    const project = await ProjectDetails.create({
      projectName,
      description,
      startDate,
      endDate,
      status,
    });
    res.status(201).json({ message: "Project created successfully", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectDetails.findAll();
    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await ProjectDetails.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await ProjectDetails.update(req.body, { where: { id } });
    if (!updated)
      return res
        .status(404)
        .json({ message: "Project not found or no changes made" });
    res.status(200).json({ message: "Project updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update project" });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const deleted = await ProjectDetails.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
