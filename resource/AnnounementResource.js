import formatDate from "../utils/formatDate.js";

export function AnnounementResource(doc) {
    if (!doc) return null;

    const o = typeof doc.toJSON === 'function' ? doc.toJSON() : doc;

    return {
        id: o.id,
        date: formatDate(o.date),
        announcement: o.announcement,
        always_show: o.always_show ? true : false
    };
}

export function AnnounementCollection(docs, meta = {}) {
    return {
        data: docs.map(AnnounementResource),
        meta
    };
}