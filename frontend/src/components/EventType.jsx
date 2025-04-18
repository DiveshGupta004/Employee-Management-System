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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const EventType = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/event-types', { withCredentials: true });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching event types:', error);
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
    const name = event.target.elements.name.value;
    try {
      if (currentItem) {
        await axios.put(`http://localhost:5000/api/event-types/${currentItem.id}`, { name }, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/event-types', { name }, { withCredentials: true });
      }
      fetchData();
      closeDialog();
    } catch (error) {
      console.error('Error submitting event type:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/event-types/${id}`, { withCredentials: true });
      fetchData();
    } catch (error) {
      console.error('Error deleting event type:', error);
    }
  };

  return (
    <div className="p-6 ">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Event Types</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>Add Event Type</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentItem ? 'Edit Event Type' : 'Add Event Type'}</DialogTitle>
              <DialogDescription>
                {currentItem ? 'Update the event type name.' : 'Create a new event type.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <input
                name="name"
                type="text"
                defaultValue={currentItem ? currentItem.name : ''}
                placeholder="Enter event type name"
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
        <TableCaption>List of all event types</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <ContextMenu key={item.id}>
              <ContextMenuTrigger asChild>
                <TableRow>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => openDialog(item)}>Edit</ContextMenuItem>
                <ContextMenuItem onClick={() => handleDelete(item.id)}>Delete</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventType;