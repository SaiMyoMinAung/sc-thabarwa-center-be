import formatDate from "../utils/formatDate.js";

export function AnnounementResource(doc) {
    if (!doc) return null;

    const o = typeof doc.toJSON === 'function' ? doc.toJSON() : doc;

    return {
        date: formatDate(o.date),
        announcement: o.announcement
    };
}

export function AnnounementCollection(docs, meta = {}) {
    return {
        data: docs.map(ManagerResource),
        meta
    };
}