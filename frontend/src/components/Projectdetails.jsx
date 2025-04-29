import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableCaption,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const ProjectDetails = () => {
    const [projects, setProjects] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [projectProgress, setProjectProgress] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newProject, setNewProject] = useState({
        projectName: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "",
    });

    const recordsPerPage = 10;

    const fetchProjects = async () => {
  try {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", recordsPerPage.toString());
    if (searchQuery) params.append("search", searchQuery);
    if (projectProgress) params.append("progress", projectProgress);

    const res = await fetch(
      `http://localhost:5000/api/projects?${params.toString()}`
    );
    const data = await res.json();

    setProjects(data || []);
    setTotalProjects(data.length || 0);
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};
      

    useEffect(() => {
        fetchProjects();
    }, [currentPage, searchQuery, projectProgress]);

    const totalPages = Math.ceil(totalProjects / recordsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch("http://localhost:5000/api/projects", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(newProject),
          });
      
          const data = await response.json();
          if (response.ok) {
            alert("Project created successfully!");
            setDialogOpen(false);
            setNewProject({
              projectName: "",
              description: "",
              startDate: "",
              endDate: "",
              status: "",
            });
      
            // Reset filters & trigger re-fetch via useEffect
            setSearchQuery("");
            setProjectProgress("");
            setCurrentPage(1); // triggers fetchProjects()
            fetchProjects();
          } else {
            alert(data.message || "Failed to create project");
          }
        } catch (error) {
          console.error("Error creating project:", error);
        }
      };
      
      

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Project Details</h2>

            <div className="flex flex-wrap items-center gap-4 mb-6">
                <Input
                    type="text"
                    placeholder="Search Project Name..."
                    className="w-full md:w-1/4"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <Select onValueChange={(value) => setProjectProgress(value)}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Planned">Planned</SelectItem>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="solid" className="w-[200px] justify-start">
                            Create Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Project</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateProject}>
                            <Input
                                type="text"
                                placeholder="Project Name"
                                value={newProject.projectName}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, projectName: e.target.value })
                                }
                                className="mb-4"
                                required
                            />
                            <Input
                                type="text"
                                placeholder="Description"
                                value={newProject.description}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, description: e.target.value })
                                }
                                className="mb-4"
                            />
                            <Input
                                type="date"
                                placeholder="Start Date"
                                value={newProject.startDate}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, startDate: e.target.value })
                                }
                                className="mb-4"
                                required
                            />
                            <Input
                                type="date"
                                placeholder="End Date"
                                value={newProject.endDate}
                                onChange={(e) =>
                                    setNewProject({ ...newProject, endDate: e.target.value })
                                }
                                className="mb-4"
                            />
                            <Select
                                onValueChange={(value) =>
                                    setNewProject({ ...newProject, status: value })
                                }
                            >
                                <SelectTrigger className="mb-4 w-full">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Planned">Planned</SelectItem>
                                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Create Project</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>

            <Table>
                <TableCaption>List of all projects</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell>{project.projectName}</TableCell>
                                <TableCell>{project.description}</TableCell>
                                <TableCell>{project.startDate}</TableCell>
                                <TableCell>{project.endDate || "-"}</TableCell>
                                <TableCell>{project.status}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No projects found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="flex justify-center mt-6 gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                >
                    Previous
                </Button>
                {totalPages > 0 &&
                    Array.from({ length: totalPages }).map((_, index) => (
                        <Button
                            key={index}
                            variant={currentPage === index + 1 ? "default" : "outline"}
                            size="sm"
                            onClick={() => paginate(index + 1)}
                        >
                            {index + 1}
                        </Button>
                    ))}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                >
                    Next
                </Button>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateProject}>
                        <Input
                            type="text"
                            placeholder="Project Name"
                            value={newProject.projectName}
                            onChange={(e) =>
                                setNewProject({ ...newProject, projectName: e.target.value })
                            }
                            className="mb-4"
                            required
                        />
                        <Input
                            type="text"
                            placeholder="Description"
                            value={newProject.description}
                            onChange={(e) =>
                                setNewProject({ ...newProject, description: e.target.value })
                            }
                            className="mb-4"
                        />
                        <Input
                            type="date"
                            placeholder="Start Date"
                            value={newProject.startDate}
                            onChange={(e) =>
                                setNewProject({ ...newProject, startDate: e.target.value })
                            }
                            className="mb-4"
                            required
                        />
                        <Input
                            type="date"
                            placeholder="End Date"
                            value={newProject.endDate}
                            onChange={(e) =>
                                setNewProject({ ...newProject, endDate: e.target.value })
                            }
                            className="mb-4"
                        />
                        <Select
                            onValueChange={(value) =>
                                setNewProject({ ...newProject, status: value })
                            }
                        >
                            <SelectTrigger className="mb-4 w-full">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Planned">Planned</SelectItem>
                                <SelectItem value="Ongoing">Ongoing</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Create Project</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProjectDetails;
