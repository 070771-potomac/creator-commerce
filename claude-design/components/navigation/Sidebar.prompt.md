16rem dashboard sidebar (shadcn sidebar) on the off-white --sidebar surface; groups nav into Overview / Selling / Buying / Settings per docs/site-tree.md.
```jsx
<Sidebar header={<Brand />} footer={<UserRow />}>
  <SidebarGroup><SidebarItem icon="layout-dashboard" label="Overview" active /></SidebarGroup>
  <SidebarGroup label="Selling">
    <SidebarItem icon="package" label="Products" />
    <SidebarItem icon="receipt" label="Sales" />
  </SidebarGroup>
</Sidebar>
```
