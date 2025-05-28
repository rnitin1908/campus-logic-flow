
import { useState, useEffect } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mongodbService } from '@/lib/services';

interface ParentLink {
  parent_id: string;
  parent_name: string;
  parent_email: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  is_primary_contact: boolean;
}

interface ParentLinkManagerProps {
  parentLinks: ParentLink[];
  onParentLinksChange: (links: ParentLink[]) => void;
}

const ParentLinkManager = ({ parentLinks, onParentLinksChange }: ParentLinkManagerProps) => {
  const [availableParents, setAvailableParents] = useState<any[]>([]);

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      const response = await mongodbService.getUsers({
        role: 'parent',
        limit: 100
      });
      setAvailableParents(response.data);
    } catch (error) {
      console.error('Error fetching parents:', error);
    }
  };

  const addParentLink = () => {
    const newLink: ParentLink = {
      parent_id: '',
      parent_name: '',
      parent_email: '',
      relationship: 'father',
      is_primary_contact: parentLinks.length === 0,
    };
    onParentLinksChange([...parentLinks, newLink]);
  };

  const updateParentLink = (index: number, field: keyof ParentLink, value: any) => {
    const updatedLinks = [...parentLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };

    // If this becomes the primary contact, make others non-primary
    if (field === 'is_primary_contact' && value) {
      updatedLinks.forEach((link, i) => {
        if (i !== index) {
          link.is_primary_contact = false;
        }
      });
    }

    // If parent is selected, populate name and email
    if (field === 'parent_id' && value) {
      const selectedParent = availableParents.find(p => p.id === value);
      if (selectedParent) {
        updatedLinks[index].parent_name = selectedParent.name;
        updatedLinks[index].parent_email = selectedParent.email;
      }
    }

    onParentLinksChange(updatedLinks);
  };

  const removeParentLink = (index: number) => {
    const updatedLinks = parentLinks.filter((_, i) => i !== index);
    onParentLinksChange(updatedLinks);
  };

  return (
    <div className="space-y-4">
      {parentLinks.map((link, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Parent {index + 1}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeParentLink(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Parent</Label>
                <Select
                  value={link.parent_id}
                  onValueChange={(value) => updateParentLink(index, 'parent_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableParents.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.name} ({parent.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Relationship</Label>
                <Select
                  value={link.relationship}
                  onValueChange={(value) => updateParentLink(index, 'relationship', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`primary-${index}`}
                checked={link.is_primary_contact}
                onCheckedChange={(checked) => 
                  updateParentLink(index, 'is_primary_contact', checked)
                }
              />
              <Label htmlFor={`primary-${index}`} className="text-xs">
                Primary contact
              </Label>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addParentLink}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Parent Link
      </Button>
    </div>
  );
};

export default ParentLinkManager;
