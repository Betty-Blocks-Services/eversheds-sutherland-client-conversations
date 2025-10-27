(() => ({
  name: 'TbtCombineFilter',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    // Component used on /trending-business-topics to provide clickable badge filters.
    // Each category (topic, sector, product) maintains its own state.
    // Clicking a badge updates the corresponding filter state (e.g., clicking a topic should triggers setFilterTopic).
    // These states are combined into a filter object, where each value is translated to its UUID.
    // After translation, the onFilterChange event is triggered to apply the advanced filter logic.
    const { debugLogging } = options;
    const isDev = B.env === 'dev';

    // Used for optional console logging
    const debugLog = (...message) => {
      if (debugLogging) {
        console.log(message);
      }
    };

    // This function translates the normal database names to the corresponding identifiers
    // to use with the Advanced Filter interaction provided by the platform.
    function translateKeys(input, availableProps) {
      if (!availableProps || typeof availableProps !== 'object') return input;

      // build name → id lookup
      const nameToId = Object.values(availableProps).reduce((map, prop) => {
        if (prop && typeof prop === 'object' && prop.name && prop.id) {
          map[prop.name] = prop.id;
        }
        return map;
      }, {});

      function recurse(node) {
        // 1) arrays: map each element
        if (Array.isArray(node)) {
          return node.map(recurse);
        }

        // 2) objects: rename keys if possible, recurse values
        if (node && typeof node === 'object') {
          return Object.keys(node).reduce((out, key) => {
            const newKey = nameToId[key] || key;
            out[newKey] = recurse(node[key]);
            return out;
          }, {});
        }

        // 3) primitives: return as‐is
        return node;
      }

      return recurse(input);
    }

    // Deeply merges two filter objects into one unified object.
    function deepMerge(A, B) {
      const OPS = new Set([
        'eq',
        'ne',
        'gt',
        'gte',
        'lt',
        'lte',
        'in',
        'nin',
        'matches',
        'contains',
      ]);

      const isPlainObject = (o) =>
        o && typeof o === 'object' && !Array.isArray(o);

      const isOpObj = (o) =>
        isPlainObject(o) && Object.keys(o).every((k) => OPS.has(k));

      // If either side isn’t a plain‐object, B wins (or A if B is undefined)
      if (!isPlainObject(A) || !isPlainObject(B)) {
        return B === undefined ? A : B;
      }

      // Merge all keys from both A & B
      return Object.entries({ ...A, ...B }).reduce((out, [key, _]) => {
        const aVal = A[key];
        const bVal = B[key];

        if (aVal !== undefined && bVal !== undefined) {
          // Both defined
          if (
            isPlainObject(aVal) &&
            isPlainObject(bVal) &&
            !isOpObj(aVal) &&
            !isOpObj(bVal)
          ) {
            // Recurse for nested filters
            out[key] = deepMerge(aVal, bVal);
          } else if (isOpObj(aVal) && isOpObj(bVal)) {
            // Leaf operator objects: merge their keys
            out[key] = { ...aVal, ...bVal };
          } else {
            // Otherwise, B overrides A
            out[key] = bVal;
          }
        } else {
          // Only one side defined: take whatever’s there
          out[key] = aVal !== undefined ? aVal : bVal;
        }

        return out;
      }, {});
    }

    const getBadgeChild = (e) => {
      const badge = e.currentTarget;
      const data = badge.childNodes[0].getHTML();
      return String(data).trim();
    };

    const [selectedTopics, setSelectedTopics] = useState(new Map());
    const [selectedSectors, setSelectedSectors] = useState(new Map());
    const [selectedProducts, setSelectedProducts] = useState(new Map());

    // This is where each of the fields are defined.
    // By defining these functions, each field can have its own logic for applying the filter.
    // These functions create the initial filter object.
    useEffect(() => {
      B.defineFunction('setFilterSector', (e) => {
        const filterValue = getBadgeChild(e);
        debugLog('Value from interaction:', filterValue);

        const value = String(getBadgeChild(e));
        const key = value.trim().toLowerCase();
        setSelectedSectors((prev) => {
          const next = new Map(prev);
          if (next.has(key)) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
          return next;
        });
      });

      B.defineFunction('setFilterProduct', (e) => {
        const filterValue = getBadgeChild(e);
        debugLog('Value from interaction:', filterValue);

        const value = String(getBadgeChild(e));
        const key = value.trim().toLowerCase();
        setSelectedProducts((prev) => {
          const next = new Map(prev);
          if (next.has(key)) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
          return next;
        });
      });

      B.defineFunction('setFilterTopic', (e) => {
        const filterValue = getBadgeChild(e);
        const value = String(getBadgeChild(e));
        const key = value.trim().toLowerCase();

        debugLog('Value from interaction:', filterValue);
        setSelectedTopics((prev) => {
          const next = new Map(prev);
          if (next.has(key)) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
          return next;
        });
      });

      B.defineFunction('Reset Combined Filter', (e) => {
        e.preventDefault();
        setSelectedSectors(new Map());
        setSelectedTopics(new Map());
      });
    }, []);

    // We simply use a useEffect hook to watch the states of our filters
    useEffect(() => {
      if (isDev) return; // Return if in dev mode.

      // Creates the initial filter object:
      // E.g.:
      // {
      //  customer: {
      //    employees: {
      //      ...
      //    }
      //  }
      // }
      const sectors = Array.from(selectedSectors.values()) || [];
      const topics = Array.from(selectedTopics.values()) || [];
      const products = Array.from(selectedProducts.values()) || [];
      const newFilter =
        sectors.length > 0 || topics.length > 0
          ? {
              _and: [
                translateKeys(
                  { _and: [{ status: { eq: 'Published' } }] },
                  window.artifact.properties,
                ),
                {
                  _or: translateKeys(
                    [
                      ...sectors.map((s) => ({ sectors: { name: { eq: s } } })),
                      ...topics.map((t) => ({
                        categories: { name: { eq: t } },
                      })),
                      ...products.map((p) => ({
                        products: { name: { eq: p } },
                      })),
                    ],
                    window.artifact.properties,
                  ),
                },
              ],
            }
          : {
              _and: translateKeys(
                [{ status: { eq: 'Published' } }],
                window.artifact.properties,
              ),
            };

      debugLog({ where: newFilter });

      if (sectors.length === 0 && topics.length === 0) {
        console.warn('No entries for filter! Resetting filter');
        B.triggerEvent('onResetFilter', undefined);
        return;
      }

      // Make sure to translate the keys of the object to identifiers
      // E.g. {
      //  abcdefg12345: {
      //     gfedcba54321: {
      //      ....
      //     }
      //   }
      // }

      if (Object.keys(newFilter).length > 0) {
        B.triggerEvent('onFilterChange', {
          where: newFilter,
        });
      } else {
        B.triggerEvent('onFilterChange', {
          where: {
            _and: translateKeys(
              [{ status: { eq: 'Published' } }],
              window.artifact.properties,
            ),
          },
        });
      }
    }, [selectedSectors.values(), selectedTopics.values()]); // ✅ watch both filters

    if (isDev) {
      return <div className={classes.dev}>Combine filter</div>;
    }

    return <></>;
  })(),
  styles: () => () => ({
    root: {},
  }),
}))();
