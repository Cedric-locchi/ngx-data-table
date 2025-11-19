# ngx-data-table - Copilot Instructions

## Project Overview

This is an **Angular library project** (Angular 20+) providing a reusable data table component (`ng-data-table`). The workspace contains:
- **Library**: `projects/ng-data-table/` - the publishable npm package
- **Demo app**: `projects/demo/` - showcases the library features

The library is published to npm with automated versioning via GitHub Actions based on commit message prefixes (`[major]`, `[minor]`, or defaults to patch).

## Architecture

### Component Hierarchy
```
DataTableComponent (main entry point)
├── ListHeaderComponent (column headers with sorting)
├── ListItemComponent (table cells)
│   └── Can dynamically load custom cell templates via BaseListItemComponent
├── DataTableHeaderComponent (optional header UI)
├── DataTableFooterComponent (optional footer UI)
└── DataTableInputSearchComponent (optional search input)
```

### Core Services
- **`DataTableManagerService`**: Manages data sources using signals (`_dataSources`), handles date formatting with Luxon, and provides cell value extraction
- **`ListManager`**: BehaviorSubject-based state management for table data and row collapse states. Use `saveData()` to update, `getDataByKey()` to retrieve column values

### Custom Cell Templates
To create custom cell renderers, extend `BaseListItemComponent` (not `BaseComponent`). The base provides:
- `rowId`, `col` properties injected by parent
- `data` signal with row data
- `getDataFromKey(key)` to access column values
- Automatic subscription to `ListManager.store`

Example pattern in `projects/ng-data-table/src/lib/core/base/table/base-list-item.component.ts`

## Development Workflow

### Commands
```bash
pnpm start              # Run demo app (serves on http://localhost:4200)
pnpm run build          # Build library with ng-packagr
pnpm run test           # Run Vitest tests with coverage
pnpm run lint           # ESLint check
pnpm run lint:fix       # Auto-fix linting issues
```

### Testing
- **Test runner**: Vitest (not Karma/Jasmine)
- **Setup**: Uses `@analogjs/vitest-angular` for Angular testing
- **Config**: `vite.config.ts` - supports testing both library and demo via `TEST_PROJECT` env var
- **Coverage**: V8 provider, outputs to `coverage/` directory
- Run library tests: `pnpm test` (default)
- Run demo tests: `TEST_PROJECT=demo pnpm test`

### Building & Publishing
1. Library builds to `dist/ng-data-table` via ng-packagr
2. Entry point: `projects/ng-data-table/src/public-api.ts` (exports all public APIs)
3. Version bumping is automated in CI - add `[major]` or `[minor]` to commit messages to control bump type
4. Manual publish: `cd dist/ng-data-table && npm publish`

## Code Conventions

### Angular Style (v20+)
Follow `instruction.md` strictly - key points:
- **Standalone components only** (no NgModules)
- **DO NOT** set `standalone: true` explicitly (default in v20+)
- Use `input()` and `output()` functions, not decorators
- Use signals for state: `signal()`, `computed()`, `input()`
- Always set `changeDetection: ChangeDetectionStrategy.OnPush`
- Native control flow: `@if`, `@for`, `@switch` (not `*ngIf`, `*ngFor`)
- Use `inject()` function, not constructor injection
- Host bindings in decorator's `host` object (not `@HostBinding`/`@HostListener`)

### TypeScript
- **Strict typing**: No `any` (enforced by ESLint)
- **Zod schemas** for runtime validation: See `colDefSchema` in `projects/ng-data-table/src/lib/core/types/coldef.ts`
- Type interfaces over type aliases (ESLint enforced)
- Unused vars prefixed with `_` are allowed

### Component Organization
- Public properties use `readonly` for signals/inputs/outputs
- Services injected as `public readonly` or `private readonly`
- Lifecycle hooks implement interfaces (`OnInit`, `OnDestroy`)
- Base classes: Use `BaseComponent` for RxJS cleanup (`$unsubscribe` Subject), `BaseListItemComponent` for custom cells

### Naming
- `colDef`: Column definition type (not `ColumnDef`)
- `dynamic`: Type alias for `Record<string, unknown>` (flexible row data)
- `isStripped`, `isClickable`, `isSortable` - boolean flags prefixed with `is`
- French labels in demo app (`headerName: 'Date de création'`)

## Key Files

- **Public API**: `projects/ng-data-table/src/public-api.ts` - defines what's exported
- **Column config**: `projects/ng-data-table/src/lib/core/types/coldef.ts` - Zod-validated column definitions
- **Main component**: `projects/ng-data-table/src/lib/data-table/data-table.component.ts`
- **Demo usage**: `projects/demo/src/app/app.component.ts` - shows full API usage
- **Library package**: `projects/ng-data-table/package.json` - version and peer deps
- **CI/CD**: `.github/workflows/pr-tests.yml` - automated testing and npm publishing

## Dependencies

- **Luxon**: Date formatting (see `DataTableManagerService.dataFromCol()`)
- **nanoid**: Unique component IDs
- **FontAwesome**: Icons via `@fortawesome/angular-fontawesome`
- **Zod**: Runtime schema validation
- **pnpm**: Package manager (see `pnpm-lock.yaml`)

## Common Patterns

### Adding a Column Feature
1. Update `colDefSchema` in `projects/ng-data-table/src/lib/core/types/coldef.ts`
2. Handle in `ListItemComponent` template rendering
3. Add example to demo app's `colDef` signal
4. Add test coverage in `.spec.ts` files

### Extending Cell Rendering
Create a component extending `BaseListItemComponent`, inject into column via `template: MyCustomComponent`. See type definition in `coldef.ts`.

### State Management
Use `ListManager.saveData()` when data changes (see `DataTableComponent.ngOnChanges`). Access via `listManager.store.pipe()` subscriptions.
