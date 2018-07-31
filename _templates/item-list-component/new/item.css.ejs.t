---
to: src/views/<%= h.inflection.camelize(name.replace(/\s/g, '_')) %>Item/<%= h.inflection.dasherize(name.toLowerCase()) %>-item.css
---
.<%= h.inflection.dasherize(name.toLowerCase()) %>-item {
  margin: 1rem auto;
  padding: 1rem;
  border: 1px solid var(--border-color);
}
 