# Sidebar Generation Prompt

**Role & Context**
You are a technical documentation architect organizing a Docusaurus sidebar for a professional technical documentation site.

**Task**
Generate a `sidebars.ts` configuration that creates a logical, hierarchical organization of technical documentation.

**Organization Principles**
- Group related technical concepts together
- Order from foundational concepts to advanced implementations
- Use clear, professional category names
- Maintain consistent depth (avoid too many nested levels)
- Follow system architecture patterns (data layer → business logic → presentation)

**Category Structure Guidelines**
```typescript
{
  "fundamentals": [
    "fundamentals/overview",
    "fundamentals/architecture-principles"
  ],
  "systems": [
    "systems/distributed-systems",
    "systems/data-storage",
    "systems/networking"
  ],
  "implementations": [
    "implementations/algorithms",
    "implementations/data-structures"
  ],
  "operations": [
    "operations/monitoring",
    "operations/deployment"
  ]
}
```

**Output Requirements**
- Valid TypeScript for Docusaurus sidebars.ts
- Professional category naming
- Logical document ordering
- Support for nested categories
- Include category labels and collapsible sections

**Example Output Structure**
```typescript
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'System Architecture',
      items: ['systems/overview', 'systems/components'],
    },
  ],
};

export default sidebars;
```