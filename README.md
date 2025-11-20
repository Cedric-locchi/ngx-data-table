# ng-data-table

A modern, type-safe Angular data table library built with Angular 20+ signals and Zod validation.

## ✨ Features

- 🎯 **Type-Safe**: Full TypeScript support with runtime validation using Zod
- ⚡ **Signal-Based**: Built with Angular signals for optimal performance
- 🎨 **Customizable**: Custom cell templates, styling options, and column configurations
- 📊 **Sorting**: Built-in column sorting with visual indicators
- 🔍 **Search**: Optional search functionality
- 🎭 **Flexible**: Support for clickable rows, date formatting, and custom rendering
- 🧪 **Well-Tested**: 85+ tests with 85%+ code coverage
- 🚀 **Modern**: Uses Angular 20+ standalone components

## 📦 Installation

```bash
npm install ng-data-table
```

Or with pnpm:

```bash
pnpm add ng-data-table
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { DataTableComponent, colDef } from 'ng-data-table';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DataTableComponent],
  template: `
    <ng-data-table
      [dataSources]="users"
      [colDef]="columns"
      [isStripped]="true"
      [displayBorder]="true"
    />
  `,
})
export class UsersComponent {
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 },
  ];

  columns: colDef[] = [
    { headerName: 'ID', field: 'id', isVisible: true },
    { headerName: 'Name', field: 'name', isVisible: true, isBold: true },
    { headerName: 'Email', field: 'email', isVisible: true },
    { headerName: 'Age', field: 'age', isVisible: true },
  ];
}
```

## 📖 API Reference

### DataTableComponent

#### Inputs

| Input           | Type       | Default      | Description                      |
| --------------- | ---------- | ------------ | -------------------------------- |
| `dataSources`   | `T[]`      | **required** | Array of data objects to display |
| `colDef`        | `colDef[]` | **required** | Column definitions               |
| `isStripped`    | `boolean`  | `false`      | Enable striped rows              |
| `displayBorder` | `boolean`  | `false`      | Display table borders            |

#### Outputs

| Output           | Type            | Description                               |
| ---------------- | --------------- | ----------------------------------------- |
| `rowIsClicked`   | `rowClicked<T>` | Emitted when a clickable row is clicked   |
| `sortDataSource` | `sortEvent`     | Emitted when a sortable column is clicked |

### Column Definition (colDef)

```typescript
interface colDef {
  headerName: string; // Column header text
  field: string; // Property name in data object
  isVisible?: boolean; // Show/hide column (default: false)
  isBold?: boolean; // Bold text (default: false)
  isDate?: boolean; // Format as date (default: false)
  isState?: boolean; // Special state styling (default: false)
  isEllipsis?: boolean; // Truncate with ellipsis (default: false)
  isClickable?: boolean; // Enable row click (default: false)
  isSortable?: boolean; // Enable column sorting (default: false)
  template?: Type<BaseListItemComponent>; // Custom cell component
}
```

## 💡 Examples

### Sortable Columns

```typescript
columns: colDef[] = [
  {
    headerName: 'Name',
    field: 'name',
    isVisible: true,
    isSortable: true
  },
  {
    headerName: 'Age',
    field: 'age',
    isVisible: true,
    isSortable: true
  },
];
```

```html
<ng-data-table [dataSources]="users" [colDef]="columns" (sortDataSource)="onSort($event)" />
```

```typescript
onSort(event: sortEvent) {
  console.log('Sort by:', event.field, 'Direction:', event.direction);
  // Implement your sorting logic
  this.users = this.users.sort((a, b) => {
    const aVal = a[event.field];
    const bVal = b[event.field];
    return event.direction === 'asc'
      ? aVal > bVal ? 1 : -1
      : aVal < bVal ? 1 : -1;
  });
}
```

### Clickable Rows

```typescript
columns: colDef[] = [
  {
    headerName: 'Name',
    field: 'name',
    isVisible: true,
    isClickable: true
  },
];
```

```html
<ng-data-table [dataSources]="users" [colDef]="columns" (rowIsClicked)="onRowClick($event)" />
```

```typescript
onRowClick(event: rowClicked<User>) {
  console.log('Clicked row:', event.row);
  console.log('Column:', event.col.field);
  console.log('Index:', event.index);
}
```

### Date Formatting

```typescript
data = [
  {
    id: 1,
    name: 'Task 1',
    createdAt: '2024-01-15T10:30:00Z'
  },
];

columns: colDef[] = [
  { headerName: 'Name', field: 'name', isVisible: true },
  {
    headerName: 'Created',
    field: 'createdAt',
    isVisible: true,
    isDate: true  // Automatically formats ISO dates
  },
];
```

### Custom Cell Templates

Create a custom component extending `BaseListItemComponent`:

```typescript
import { Component } from '@angular/core';
import { BaseListItemComponent } from 'ng-data-table';

@Component({
  selector: 'app-status-cell',
  standalone: true,
  template: `
    <div [class]="statusClass">
      {{ getDataFromKey('status') }}
    </div>
  `,
  styles: [
    `
      .active {
        color: green;
        font-weight: bold;
      }
      .inactive {
        color: red;
      }
    `,
  ],
})
export class StatusCellComponent extends BaseListItemComponent {
  get statusClass() {
    const status = this.getDataFromKey('status');
    return status === 'active' ? 'active' : 'inactive';
  }
}
```

Use it in your column definition:

```typescript
import { StatusCellComponent } from './status-cell.component';

columns: colDef[] = [
  { headerName: 'Name', field: 'name', isVisible: true },
  {
    headerName: 'Status',
    field: 'status',
    isVisible: true,
    template: StatusCellComponent  // Custom rendering
  },
];
```

### Styling Options

```html
<!-- Striped rows -->
<ng-data-table [dataSources]="data" [colDef]="columns" [isStripped]="true" />

<!-- With borders -->
<ng-data-table [dataSources]="data" [colDef]="columns" [displayBorder]="true" />

<!-- Both -->
<ng-data-table [dataSources]="data" [colDef]="columns" [isStripped]="true" [displayBorder]="true" />
```

## 🔒 Type Safety with Zod

This library uses Zod for runtime validation, ensuring type safety at runtime:

```typescript
// Column definitions are validated
const columns: colDef[] = [
  {
    headerName: 'Name', // ✅ Valid
    field: 'name',
    isVisible: true,
  },
  {
    headerName: 123, // ❌ Error: headerName must be string
    field: 'age',
    isVisible: 'yes', // ❌ Error: isVisible must be boolean
  },
];
```

All inputs and outputs are validated at runtime, providing clear error messages during development.

## 🛠️ Development

### Build the library

```bash
npm run build
```

### Run tests

```bash
npm test
```

### Lint

```bash
npm run lint
npm run lint:fix
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Dependencies

- Angular 20+
- Zod 4+
- Luxon (for date formatting)
- FontAwesome (for icons)

## 🔗 Links

- [GitHub Repository](https://github.com/cedriclocchi/ngx-data-table)
- [Issue Tracker](https://github.com/cedriclocchi/ngx-data-table/issues)
