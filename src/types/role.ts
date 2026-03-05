export type Permission = {
  id: string;
  code: string;
};

export type RolePermission = {
  id: string;
  roleId: string;
  permissionId: string;
  permission: Permission;
};

export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions?: RolePermission[];
};
