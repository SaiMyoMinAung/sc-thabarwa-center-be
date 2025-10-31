export function ManagerResource(doc) {
    if (!doc) return null;

    const o = typeof doc.toJSON === 'function' ? doc.toJSON() : doc;

    return {
        email: o.email,
    };
}

export function ManagerCollection(docs, meta = {}) {
    return {
        data: docs.map(ManagerResource),
        meta
    };
}