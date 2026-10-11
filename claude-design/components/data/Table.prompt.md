Data table for the Products, Sales, Purchases and Downloads archetype; 40px header, 8px cells, hairline row dividers, muted hover.
```jsx
<Table columns={[{ key: "title", label: "Product" }, { key: "status", label: "Status", render: r => <Badge variant="success">{r.status}</Badge> },
  { key: "price", label: "Price", align: "right" }]} rows={products} onRowClick={open} />
```
Right-align money; use tabular numbers. Wrap in a Card for dashboard pages.
