import formatDate from "../utils/formatDate.js";

export function DhammaEventResource(doc) {
    if (!doc) return null;

    const o = typeof doc.toJSON === 'function' ? doc.toJSON() : doc;

    return {
        id: o.id,
        phone: o.phone,
        date: formatDate(o.date),
        event_for: o.event_for,
        title: o.title,
        description: o.description,
        address: o.address,
        created_at: formatDate(o.createdAt),
        confirm: o.confirm ? true : false
    };
}

export function DhammaEventCollection(docs, meta = {}) {
    return {
        data: docs.map(DhammaEventResource),
        meta
    };
}