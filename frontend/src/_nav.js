export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
      permission: 'dashboard'
    },
    
    {
      name: 'Configurations',
      url: '',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Users',
          url: '/users',
          icon: 'icon-puzzle',
          permission: 'users_list',
        },
        {
          name: 'Roles',
          url: '/roles',
          icon: 'icon-puzzle',
          permission: 'roles_list'
        },
        {
          name: 'Settings',
          url: '/settings',
          icon: 'icon-puzzle',
          permission: 'settings'
        },
      ],
    },

    {
      name: 'Management',
      url: '',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Profiles',
          url: '/profiles',
          icon: 'icon-puzzle',
          permission: 'profiles_list',
        },
      ],
    },
  ],
};
