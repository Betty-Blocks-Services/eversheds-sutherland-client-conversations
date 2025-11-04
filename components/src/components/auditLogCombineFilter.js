(() => ({
  name: 'AuditLogCombineFilter',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { debugLogging, modelId } = options;
    const { env } = B;
    const isDev = env === 'dev';

    const debugLog = (message) => {
      if (debugLogging) {
        console.log(message);
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
    const [filterMessage, setFilterMessage] = useState({});
    const [filterDateStartRange, setFilterDateStartRange] = useState({});
    const [filterDateEndRange, setFilterDateEndRange] = useState({});

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

    // This is where each of the fields are defined.
    // By defining these functions, each field can have its own logic for applying the filter.
    // These functions create the initial filter object.

    useEffect(() => {
      B.defineFunction('setFilterAction', (v) => {
        const filter = v ? { message: { matches: v } } : undefined;
        setFilterMessage(filter);
      });

      B.defineFunction('setFilterStartDateRange', (v) => {
        const filter = v ? { createdAt: { gteq: v } } : undefined;
        setFilterDateStartRange(filter);
      });

      B.defineFunction('setFilterEndDateRange', (v) => {
        const filter = v ? { createdAt: { lteq: v } } : undefined;
        setFilterDateEndRange(filter);
      });
    }, []);

    // We simply use a useEffect hook to watch the states of our filters
    useEffect(() => {
      if (isDev) return;

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
        ...filterMessage,
        _and: [...filterDateStartRange, ...filterDateEndRange],
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
      const translatedFilter = translateWithRelationalMap(
        newFilter,
        relationalMap,
      );

      debugLog({ translatedFilter });

      const interactionFilter = {
        where: {
          _and: [translatedFilter],
        },
      };

      debugLog({ interactionFilter });

      if (Object.keys(newFilter).length > 0) {
        B.triggerEvent('onFilterChange', interactionFilter);
      } else {
        B.triggerEvent('onFilterChange', undefined);
      }
    }, [filterDateStartRange, filterDateEndRange, filterMessage]);

    if (isDev) {
      return <div className={classes.dev}>Combine filter</div>;
    }

    return <></>;
  })(),
  styles: () => () => ({
    root: {},
  }),
}))();
