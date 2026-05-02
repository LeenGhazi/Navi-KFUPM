import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate } from 'react-router';
import { mockLocations } from '../../mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { Badge } from '../Components/ui/badge';
import { ScrollArea } from '../Components/ui/scroll-area';
import { Checkbox } from '../Components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '../Components/ui/dialog';
import { Filter, Plus, Trash2, Edit, MapPin } from 'lucide-react';
import { toast } from 'sonner';
const initialCategories = [
    { id: 'cat1', name: 'Academic Buildings', value: 'academic', buildingCount: 15, createdDate: '2024-01-10', assignedBuildings: [] },
    { id: 'cat2', name: 'Restaurants', value: 'restaurant', buildingCount: 8, createdDate: '2024-01-10', assignedBuildings: [] },
    { id: 'cat3', name: 'Cafes', value: 'cafe', buildingCount: 12, createdDate: '2024-01-10', assignedBuildings: [] },
    { id: 'cat4', name: 'Dormitories', value: 'dorm', buildingCount: 6, createdDate: '2024-01-10', assignedBuildings: [] },
    { id: 'cat5', name: 'Parking', value: 'parking', buildingCount: 10, createdDate: '2024-01-10', assignedBuildings: [] },
    { id: 'cat6', name: 'Study Rooms', value: 'study_room', buildingCount: 20, createdDate: '2024-01-10', assignedBuildings: [] },
    { id: 'cat7', name: 'Prayer Rooms', value: 'prayer_room', buildingCount: 14, createdDate: '2024-01-10', assignedBuildings: [] },
    { id: 'cat8', name: 'Library', value: 'library', buildingCount: 3, createdDate: '2024-01-10', assignedBuildings: [] },
    { id: 'cat9', name: 'Sports Facilities', value: 'sports', buildingCount: 5, createdDate: '2024-01-10', assignedBuildings: [] },
];
{/* FilterManagementPage component is responsible for managing filter categories used for building classification on the map. 
  It allows maintenance staff to add, edit, delete categories, and assign buildings to each category. 
  The component uses various UI components such as Card, Dialog, and Tabs to provide an interactive interface for managing filters. */  }
    export function FilterManagementPage() {
        const { user } = useAuth();
        const [categories, setCategories] = useState([]);
        const [buildings] = useState(mockLocations);
        const [showAddDialog, setShowAddDialog] = useState(false);
        const [showEditDialog, setShowEditDialog] = useState(false);
        const [showBuildingsDialog, setShowBuildingsDialog] = useState(false);
        const [selectedCategory, setSelectedCategory] = useState(null);
        const [formData, setFormData] = useState({ name: '', value: '' });
        const [selectedBuildings, setSelectedBuildings] = useState([]);

        useEffect(() => {
          fetch(`${import.meta.env.VITE_API_URL}/api/map-categories`)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
        }, []);

        if (!user || user.role !== 'maintenance_staff') {
            return <Navigate to="/" replace/>;
        }
        {/* Handler function to add a new filter category. It validates the input fields, creates a new category object, updates the state with the new category, and shows a success toast message. 
          If validation fails, it shows an error toast message. */  }
    const handleAddCategory = async () => {
      if (!formData.name.trim() || !formData.value.trim()) {
        toast.error('Please fill in all fields');
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/map-categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryName: formData.value.toLowerCase().replace(/\s+/g, '_'),
            displayLabel: formData.name,
            order: categories.length + 1,
            active: true,
          }),
        });

        if (!res.ok) throw new Error("Failed to add category");

        const newCategory = await res.json();

        setCategories(prev => [...prev, newCategory]);

        toast.success('New filter category added successfully!');

        setFormData({ name: '', value: '' });
        setShowAddDialog(false);

      } catch (err) {
        console.error(err);
        toast.error('Failed to add category');
      }
    };
    {/* Handler function to edit an existing filter category. It validates the input fields, updates the category object, and shows a success toast message. 
      If validation fails, it shows an error toast message. */  }
      const handleEditCategory = async () => {
        if (!selectedCategory || !formData.name.trim() || !formData.value.trim()) {
          toast.error('Please fill in all fields');
          return;
        }

        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/map-categories/${selectedCategory._id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                categoryName: formData.value.toLowerCase().replace(/\s+/g, '_'),
                displayLabel: formData.name,
              }),
            }
          );

          if (!res.ok) throw new Error("Failed to update category");

          const updatedCategory = await res.json();

          setCategories(prev =>
            prev.map(cat =>
              cat._id === selectedCategory._id ? updatedCategory : cat
            )
          );

          toast.success('Filter category updated successfully!');
          setShowEditDialog(false);
          setSelectedCategory(null);
          setFormData({ name: '', value: '' });
        } catch (err) {
          console.error(err);
          toast.error('Failed to update category');
        }
      };
    {/* Handler function to delete a filter category. It checks if the category has any buildings assigned and shows an error toast message if so. 
      Otherwise, it removes the category from the state and shows a success toast message. */  }
    const handleDeleteCategory = async (categoryId) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/map-categories/${categoryId}`,
          {
            method: "DELETE",
          }
        );

        if (!res.ok) throw new Error("Failed to delete category");

        setCategories(prev => prev.filter(cat => cat._id !== categoryId));

        toast.success('Filter category deleted successfully!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete category');
      }
    };
    {/* function to open the edit dialog for a specific category. It sets the selected category and pre-fills the form data with the category's current name and value. */  }
    const openEditDialog = (category) => {
      setSelectedCategory(category);
      setFormData({
        name: category.displayLabel || '',
        value: category.categoryName || '',
      });
      setShowEditDialog(true);
    };
    {/*  function to open the add category dialog. It resets the form data and shows the add dialog. */  }
    const openAddDialog = () => {
        setFormData({ name: '', value: '' });
        setShowAddDialog(true);
    };
    {/* function to open the manage buildings dialog for a specific category. It sets the selected category, 
      retrieves the assigned buildings for that category, and shows the buildings dialog. */  }
    const openBuildingsDialog = (category) => {
        setSelectedCategory(category);
        setSelectedBuildings(category.assignedBuildings || []);
        setShowBuildingsDialog(true);
    };
    {/* function to toggle the assignment of a building to the selected category. */  }
    const handleToggleBuilding = (buildingId) => {
        setSelectedBuildings(prev => prev.includes(buildingId)
            ? prev.filter(id => id !== buildingId)
            : [...prev, buildingId]);
    };
    {/* function to save the building assignments for the selected category. */  }
    const handleSaveBuildingAssignments = () => {
        if (!selectedCategory)
            return;
        setCategories(prev => prev.map(cat => cat.id === selectedCategory.id
            ? { ...cat, assignedBuildings: selectedBuildings, buildingCount: selectedBuildings.length }
            : cat));
        toast.success('Building assignments saved successfully!');
        setShowBuildingsDialog(false);
        setSelectedCategory(null);
        setSelectedBuildings([]);
    };
    return (<div className="container mx-auto px-4 py-8">{/* Main container for the filter management page with padding. 
    It includes a header section with a title and description. */  }
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Filter Management</h1>
          <p className="text-muted-foreground">
            Manage service categories for map filters and building classification
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2"/>
          Add New Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {categories.map((category) => (<Card key={category._id} className="hover:shadow-md transition-shadow">{/* Card component for each filter category. It displays the category name, value, number of assigned buildings, and creation date. 
        It also includes buttons to edit the category, delete the category . */  }
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary"/>
                  <CardTitle className="text-lg">{category.displayLabel}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEditDialog(category)}>
                    <Edit className="w-4 h-4"/>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteCategory(category._id)}>
                    <Trash2 className="w-4 h-4 text-red-600"/>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>{/* Card content displaying category details such as value, number of assigned buildings, and creation date. 
            It also includes a button to manage building assignments for the category. */  }
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Value:</span>
                  <Badge variant="outline">{category.categoryName}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Buildings:</span>
                  <Badge>{category.buildingCount}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-xs">
                    {new Date(category.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => openBuildingsDialog(category)}>
                  <MapPin className="w-4 h-4 mr-2"/>
                  Manage Buildings
                </Button>
              </div>
            </CardContent>
          </Card>))}
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>{/* Dialog component for adding a new filter category.
       It includes input fields for category name and value, and buttons to add the category or cancel. */  }
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5"/>
              Add New Filter Category
            </DialogTitle>
            <DialogDescription>
              Create a new service category for building classification
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input id="name" placeholder="e.g., Medical Centers" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Category Value *</Label>
              <Input id="value" placeholder="e.g., medical_center" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })}/>
              <p className="text-xs text-muted-foreground">
                Use lowercase letters and underscores only (e.g., study_room)
              </p>
            </div>

            <div className="flex gap-2 pt-4">{/* Buttons to add the new category or cancel the action. The "Add Category" button calls the handleAddCategory function, while the "Cancel" button closes the dialog. */  }
              <Button onClick={handleAddCategory} className="flex-1">
                Add Category
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>{/* Dialog component for editing an existing filter category. 
      It includes input fields pre-filled with the selected category's current name and value, and buttons to save changes or cancel. */  }
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5"/>
              Edit Filter Category
            </DialogTitle>
            <DialogDescription>
              Update the category name and value
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name *</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-value">Category Value *</Label>
              <Input id="edit-value" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })}/>
              <p className="text-xs text-muted-foreground">
                Use lowercase letters and underscores only
              </p>
            </div>
            {/* Warning message if the selected category has buildings assigned. It informs the user that changing the category value may affect existing assignments. */  }

            {selectedCategory && selectedCategory.buildingCount > 0 && (<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This category is assigned to {selectedCategory.buildingCount} building(s).
                  Changing the value may affect existing assignments.
                </p>
              </div>)}

            <div className="flex gap-2 pt-4">{/* Buttons to save the changes to the category or cancel the action. 
            The "Save Changes" button calls the handleEditCategory function, while the "Cancel" button closes the dialog and resets the selected category. */  }
              <Button onClick={handleEditCategory} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Buildings Dialog */}
      <Dialog open={showBuildingsDialog} onOpenChange={setShowBuildingsDialog}>{/* Dialog component for managing building assignments for a selected category. 
      It includes a list of all buildings with checkboxes to assign or unassign them from the category, and buttons to save the assignments or cancel. */  }
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5"/>
              Assign Buildings to {selectedCategory?.name}
            </DialogTitle>
            <DialogDescription>
              Select buildings to assign to this filter category
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {selectedBuildings.length} of {buildings.length} buildings selected
            </div>

            <ScrollArea className="h-[400px] border rounded-md p-4">{/* ScrollArea containing a list of all buildings with checkboxes.
             Each building can be assigned or unassigned from the selected category by toggling the checkbox. */  }
              <div className="space-y-2">{/* Mapping over the list of buildings to render a checkbox for each building. 
              The checkbox is checked if the building is currently assigned to the selected category. Toggling the checkbox will call the handleToggleBuilding function to update the selected buildings state. */  }
                {buildings.map((building) => (<div key={building.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md">
                    <Checkbox id={`building-${building.id}`} checked={selectedBuildings.includes(building.id)} onCheckedChange={() => handleToggleBuilding(building.id)}/>
                    <label htmlFor={`building-${building.id}`} className="flex-1 text-sm font-medium cursor-pointer">
                      {building.name}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {building.category}
                      </Badge>
                    </label>
                  </div>))}
              </div>
            </ScrollArea>

            <div className="flex gap-2 pt-4">{/* Buttons to save the building assignments or cancel the action.
             The "Save Assignments" button calls the handleSaveBuildingAssignments function, while the "Cancel" button closes the dialog and resets the selected category and buildings. */  }
              <Button onClick={handleSaveBuildingAssignments} className="flex-1">
                Save Assignments
              </Button>
              <Button variant="outline" onClick={() => {
            setShowBuildingsDialog(false);
            setSelectedCategory(null);
            setSelectedBuildings([]);
        }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>);
}
