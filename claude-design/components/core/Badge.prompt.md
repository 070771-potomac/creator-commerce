Small pill (20px high, fully rounded) for status and counts — Published/Draft, refund state, file type.
```jsx
<Badge variant="success">Published</Badge>
<Badge variant="outline">Draft</Badge>
<Badge variant="secondary" icon="file-text">PDF</Badge>
```
Status mapping: Published → success, Draft → outline, Refund requested → warning, Rejected → destructive, Approved → success.
