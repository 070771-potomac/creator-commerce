White surface with a 1px 10%-foreground ring (no drop shadow) and 10px radius; the container for KPIs, forms, centered-card pages.
```jsx
<Card>
  <CardHeader title="Revenue" description="Last 30 days" action={<Button variant="ghost" size="icon-sm" icon="more-horizontal" />} />
  <CardContent>€1,284.00</CardContent>
  <CardFooter><Button size="sm">View sales</Button></CardFooter>
</Card>
```
size="sm" tightens spacing to 12px. Footer is muted/50 with a top border.
