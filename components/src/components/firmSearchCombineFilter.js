(() => ({
  name: 'FirmSearchCombineFilter',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { debugLogging, modelId } = options;
    const { env } = B;
    const isDev = env === 'dev';

    const debugLog = (message, ...optionalParams) => {
      if (debugLogging) {
        console.log(message, optionalParams);
      }
    };

    // ------------ schema builder (P_UUID) ------------
    function buildRelationalMap(
      propertiesById,
      rootModelId,
      { depth = 1 } = {},
    ) {
      const ALL = Object.values(propertiesById);
      const propsByModel = new Map();
      for (const p of ALL) {
        if (!propsByModel.has(p.modelId)) propsByModel.set(p.modelId, []);
        propsByModel.get(p.modelId).push(p);
      }

      const REL_KINDS = new Set([
        'belongs_to',
        'has_many',
        'has_and_belongs_to_many',
      ]);

      function makeNode(modelId, d, visiting) {
        const props = propsByModel.get(modelId) || [];
        const node = {};

        for (const p of props) {
          // Store the UUID under P_UUID (never "id")
          node[p.name] = { P_UUID: p.id };

          // Expand relations
          if (REL_KINDS.has(p.kind) && p.referenceModelId && d > 0) {
            const toModel = p.referenceModelId;
            if (!visiting.has(toModel)) {
              visiting.add(toModel);
              const child = makeNode(toModel, d - 1, visiting);
              // merge children (keep P_UUID alongside)
              Object.assign(node[p.name], child);
              visiting.delete(toModel);
            }
          }
        }
        return node;
      }

      return makeNode(rootModelId, depth, new Set([rootModelId]));
    }

    // ------------ translator (uses P_UUID) ------------
    function translateWithRelationalMap(input, schemaNode) {
      if (Array.isArray(input)) {
        return input.map((v) => translateWithRelationalMap(v, schemaNode));
      }
      if (input && typeof input === 'object') {
        const out = {};
        for (const key of Object.keys(input)) {
          const val = input[key];

          // If key exists in schema, translate to its P_UUID; else keep key as-is (operators, etc.)
          const entry = schemaNode?.[key];
          const newKey = entry?.P_UUID || key;

          // Child schema = all children except P_UUID
          let childSchema = schemaNode;
          if (entry && typeof entry === 'object') {
            childSchema = Object.fromEntries(
              Object.entries(entry).filter(([k]) => k !== 'P_UUID'),
            );
          }

          out[newKey] = translateWithRelationalMap(val, childSchema);
        }
        return out;
      }
      return input;
    }
    const properties = isDev ? {} : window.artifact.properties || {};

    const relationalMap = buildRelationalMap(properties, modelId);

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
        console.log({ v });
        if (v && v.name) {
          const filter = v ? { country: { eq: v.name } } : undefined;
          setFilterCountry(filter);
        } else {
          setFilterCountry({});
          console.error(
            "Country onChange interaction should be an object with a 'name' key",
          );
        }
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
      const interactionFilter = translateWithRelationalMap(
        newFilter,
        relationalMap,
      );

      debugLog({ interactionFilter });

      if (Object.keys(newFilter).length > 0) {
        B.triggerEvent('onFilterChange', {
          where: {
            _and: [interactionFilter],
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
