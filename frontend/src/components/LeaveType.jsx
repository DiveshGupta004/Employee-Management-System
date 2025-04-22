import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

function LeaveType() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState([]);

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leave-types', { withCredentials: true });
      setLeaveTypes(response.data);
    } catch (error) {
      console.error('Error fetching leave types:', error);
    }
  };

  const openDialog = (item = null) => {
    setCurrentItem(item);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setCurrentItem(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const type = event.target.elements.type.value;
    try {
      if (currentItem) {
        await axios.put(`http://localhost:5000/api/leave-types/${currentItem.id}`, { type }, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/leave-types', { type }, { withCredentials: true });
      }
      fetchLeaveTypes();
      closeDialog();
    } catch (error) {
      console.error('Error submitting leave type:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/leave-types/${id}`, { withCredentials: true });
      fetchLeaveTypes();
    } catch (error) {
      console.error('Error deleting leave type:', error);
    }
  };

  return (
    <div className="p-6 ">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Leave Types</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>Add Leave Type</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentItem ? 'Edit Leave Type' : 'Add Leave Type'}</DialogTitle>
              <DialogDescription>
                {currentItem ? 'Update the leave type name.' : 'Create a new leave type.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <input
                name="type"
                type="text"
                defaultValue={currentItem ? currentItem.type : ''}
                placeholder="Enter leave type name"
                required
                className="w-full px-4 py-2 border rounded-md text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>List of all leave types</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">Leave Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveTypes.map(leaveType => (
            <ContextMenu key={leaveType.id}>
              <ContextMenuTrigger asChild>
                <TableRow>
                  <TableCell>{leaveType.type}</TableCell>
                </TableRow>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => openDialog(leaveType)}>Edit</ContextMenuItem>
                <ContextMenuItem onClick={() => handleDelete(leaveType.id)}>Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default LeaveType;
