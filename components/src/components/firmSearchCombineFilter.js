(() => ({
  name: 'FirmSearchCombineFilter',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const isDev = B.env === 'dev';
    const { debugLogging } = options;

    const debugLog = (message) => {
      if (debugLogging) {
        console.log(message);
      }
    };

    const [filterCountry, setFilterCountry] = useState({});
    const [filterPreferred, setFilterPreferred] = useState({});
    const [filterSearch, setFilterSearch] = useState({});

    // This function translates the normal database names to the correspdoning identifiers
    // to use with the Advanced Filter interaction provided by the platform.
    function translateKeys(input, availableProps) {
      // build name → id lookup
      const nameToId = Object.values(availableProps).reduce((map, prop) => {
        map[prop.name] = prop.id;
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

    // This is where each of the fields are defined.
    // By defining these functions, each field can have its own logic for applying the filter.
    // Thse functions create the initial filter object.

    useEffect(() => {
      B.defineFunction('setFilterCountry', (v) => {
        debugLog('setFilterCountry', { value: v });
        const filter = v ? { country: { eq: v } } : undefined;
        setFilterCountry(filter);
      });

      B.defineFunction('toggleFilterPrefOn', () => {
        debugLog('toggleFilterPrefOn');
        setFilterPreferred({ preferred: { eq: true } });
      });
      B.defineFunction('toggleFilterPrefAllOn', () => {
        debugLog('toggleFilterPrefAllOn');
        setFilterPreferred(undefined);
      });
      B.defineFunction('toggleFilterPrefAltOn', () => {
        debugLog('toggleFilterPrefAltOn');
        setFilterPreferred({ preferred: { eq: false } });
      });

      B.defineFunction('setFilterSearch', (v) => {
        debugLog('setFilterSearch', { value: v });
        const filter = v ? { name: { matches: v } } : undefined;
        setFilterSearch(filter);
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
      const newFilter = {
        ...filterCountry,
        ...filterSearch,
        ...filterPreferred,
      };

      debugLog({ newFilter });

      if (Object.keys(newFilter).length === 0) {
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
      const translatedFilter = translateKeys(
        newFilter,
        window.artifact.properties,
      );

      debugLog({ translatedFilter });

      if (Object.keys(newFilter).length > 0) {
        B.triggerEvent('onFilterChange', {
          where: {
            _and: [translatedFilter],
          },
        });
      } else {
        B.triggerEvent('onFilterChange', undefined);
      }
    }, [filterCountry, filterPreferred, filterSearch]);

    if (isDev) {
      return <div className={classes.dev}>Combine filter</div>;
    }

    return <></>;
  })(),
  styles: () => () => ({
    root: {},
  }),
}))();
