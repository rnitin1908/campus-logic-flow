
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { mongodbService } from '@/lib/services';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import UserList from '@/components/users/UserList';
import AddUserForm from '@/components/users/AddUserForm';
import EditUserModal from '@/components/users/EditUserModal';
import UserFilters from '@/components/users/UserFilters';
import { User } from '@/types/user';
import { USER_ROLES } from '@/lib/constants/roles';

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('all-users');

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await mongodbService.getUsers({
        limit: 100,
        sortBy: 'created_at',
        sortOrder: 'desc',
        role: roleFilter,
        search: searchValue
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, searchValue]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUserUpdated = () => {
    fetchUsers();
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleUserAdded = () => {
    fetchUsers();
    toast({
      title: "Success",
      description: "User added successfully",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, assign roles, classes, and link students to parents.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex">
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="add-user">Add User</TabsTrigger>
        </TabsList>

        <TabsContent value="all-users" className="space-y-4">
          <UserFilters
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          
          <UserList
            users={users}
            isLoading={isLoading}
            onEditUser={handleEditUser}
            onRefresh={fetchUsers}
          />
        </TabsContent>

        <TabsContent value="add-user">
          <AddUserForm onUserAdded={handleUserAdded} />
        </TabsContent>
      </Tabs>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default UserManagement;
