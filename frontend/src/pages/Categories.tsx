
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Tag } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoryType {
  category_id: number;
  category_name: string;
  item_count: number;
}

// Sample categories data
const initialCategories: CategoryType[] = [
  { category_id: 1, category_name: "Electronics", item_count: 32 },
  { category_id: 2, category_name: "Office Supplies", item_count: 45 },
  { category_id: 3, category_name: "Furniture", item_count: 18 },
  { category_id: 4, category_name: "IT Equipment", item_count: 27 },
  { category_id: 5, category_name: "Kitchen", item_count: 14 },
  { category_id: 6, category_name: "Security", item_count: 9 },
  { category_id: 7, category_name: "Cleaning Supplies", item_count: 21 },
];

const Categories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryType[]>(initialCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [formData, setFormData] = useState<Partial<CategoryType>>({
    category_name: ""
  });

  const columns = [
    { header: "ID", accessor: "category_id" as keyof CategoryType },
    { header: "Category Name", accessor: "category_name" as keyof CategoryType },
    { 
      header: "Item Count", 
      accessor: "item_count" as keyof CategoryType,
      cell: (item: CategoryType) => (
        <span className="font-mono">{item.item_count.toLocaleString()}</span>
      )
    },
  ];

  const handleAddCategory = () => {
    setFormData({
      category_name: ""
    });
    setIsAddDialogOpen(true);
  };

  const handleEditCategory = (category: CategoryType) => {
    setSelectedCategory(category);
    setFormData({
      category_name: category.category_name
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteCategory = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveCategory = () => {
    // Validate form
    if (!formData.category_name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category name is required!",
      });
      return;
    }

    if (isAddDialogOpen) {
      // Add new category
      const newCategory: CategoryType = {
        category_id: Math.max(...categories.map(c => c.category_id), 0) + 1,
        category_name: formData.category_name,
        item_count: 0 // New categories start with 0 items
      };
      
      setCategories([...categories, newCategory]);
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Category added successfully!",
      });
    } else if (isEditDialogOpen && selectedCategory) {
      // Update existing category
      const updatedCategories = categories.map(cat => 
        cat.category_id === selectedCategory.category_id 
          ? { ...cat, category_name: formData.category_name || cat.category_name } 
          : cat
      );
      
      setCategories(updatedCategories);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Category updated successfully!",
      });
    }
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      // Check if category has items
      if (selectedCategory.item_count > 0) {
        toast({
          variant: "destructive",
          title: "Cannot Delete",
          description: `This category has ${selectedCategory.item_count} items assigned. Please reassign or delete the items first.`,
        });
        setIsDeleteDialogOpen(false);
        return;
      }
      
      const updatedCategories = categories.filter(cat => cat.category_id !== selectedCategory.category_id);
      setCategories(updatedCategories);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Category deleted successfully!",
      });
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Category Management" 
        subtitle="Manage inventory item categories"
        actionLabel="Add New Category"
        onAction={handleAddCategory}
      />

      <DataTable
        columns={columns}
        data={categories}
        idField="category_id"
        searchField="category_name"
        actions={(category) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEditCategory(category);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`text-destructive hover:text-destructive ${category.item_count > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (category.item_count === 0) {
                  handleDeleteCategory(category);
                } else {
                  toast({
                    variant: "destructive",
                    title: "Cannot Delete",
                    description: `This category has ${category.item_count} items assigned. Please reassign or delete the items first.`,
                  });
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Add a new inventory item category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category_name">Category Name</Label>
              <Input
                id="category_name"
                name="category_name"
                placeholder="Enter category name"
                value={formData.category_name || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category_name">Category Name</Label>
              <Input
                id="edit-category_name"
                name="category_name"
                placeholder="Enter category name"
                value={formData.category_name || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCategory}>
              <Tag className="mr-2 h-4 w-4" />
              Update Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete ${selectedCategory?.category_name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </PageLayout>
  );
};

export default Categories;
