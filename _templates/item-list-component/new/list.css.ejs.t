---
to: src/views/<%= h.inflection.camelize(name.replace(/\s/g, '_')) %>List/<%= h.inflection.dasherize(name.toLowerCase()) %>-list.css
---
.<%= h.inflection.dasherize(name.toLowerCase()) %>-list {
  max-width: 24rem;
  margin: 1rem auto;
  padding: 1rem;
  border: 1px solid var(--border-color);
}
 