import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router';
import { mockLocations } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '@/app/components/ui/dialog';
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
export function FilterManagementPage() {
    const { user } = useAuth();
    const [categories, setCategories] = useState(initialCategories);
    const [buildings] = useState(mockLocations);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showBuildingsDialog, setShowBuildingsDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', value: '' });
    const [selectedBuildings, setSelectedBuildings] = useState([]);
    if (!user || user.role !== 'maintenance_staff') {
        return <Navigate to="/" replace/>;
    }
    const handleAddCategory = () => {
        if (!formData.name.trim() || !formData.value.trim()) {
            toast.error('Please fill in all fields');
            return;
        }
        const newCategory = {
            id: `cat${Date.now()}`,
            name: formData.name,
            value: formData.value.toLowerCase().replace(/\s+/g, '_'),
            buildingCount: 0,
            createdDate: new Date().toISOString().split('T')[0],
        };
        setCategories([...categories, newCategory]);
        toast.success('New filter category added successfully!');
        setFormData({ name: '', value: '' });
        setShowAddDialog(false);
    };
    const handleEditCategory = () => {
        if (!selectedCategory || !formData.name.trim() || !formData.value.trim()) {
            toast.error('Please fill in all fields');
            return;
        }
        setCategories(prev => prev.map(cat => cat.id === selectedCategory.id
            ? { ...cat, name: formData.name, value: formData.value.toLowerCase().replace(/\s+/g, '_') }
            : cat));
        toast.success('Filter category updated successfully!');
        setShowEditDialog(false);
        setSelectedCategory(null);
        setFormData({ name: '', value: '' });
    };
    const handleDeleteCategory = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        if (category && category.buildingCount > 0) {
            toast.error(`Cannot delete category with ${category.buildingCount} buildings assigned`);
            return;
        }
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        toast.success('Filter category deleted successfully!');
    };
    const openEditDialog = (category) => {
        setSelectedCategory(category);
        setFormData({ name: category.name, value: category.value });
        setShowEditDialog(true);
    };
    const openAddDialog = () => {
        setFormData({ name: '', value: '' });
        setShowAddDialog(true);
    };
    const openBuildingsDialog = (category) => {
        setSelectedCategory(category);
        setSelectedBuildings(category.assignedBuildings || []);
        setShowBuildingsDialog(true);
    };
    const handleToggleBuilding = (buildingId) => {
        setSelectedBuildings(prev => prev.includes(buildingId)
            ? prev.filter(id => id !== buildingId)
            : [...prev, buildingId]);
    };
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
    return (<div className="container mx-auto px-4 py-8">
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
        {categories.map((category) => (<Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary"/>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEditDialog(category)}>
                    <Edit className="w-4 h-4"/>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteCategory(category.id)}>
                    <Trash2 className="w-4 h-4 text-red-600"/>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Value:</span>
                  <Badge variant="outline">{category.value}</Badge>
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
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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

            <div className="flex gap-2 pt-4">
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
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
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

            {selectedCategory && selectedCategory.buildingCount > 0 && (<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This category is assigned to {selectedCategory.buildingCount} building(s).
                  Changing the value may affect existing assignments.
                </p>
              </div>)}

            <div className="flex gap-2 pt-4">
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
      <Dialog open={showBuildingsDialog} onOpenChange={setShowBuildingsDialog}>
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

            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="space-y-2">
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

            <div className="flex gap-2 pt-4">
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
