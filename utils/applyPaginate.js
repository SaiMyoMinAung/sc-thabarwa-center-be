const applyPaginate = async (baseQuery, query, req) => {

    const page = Math.max(1, parseInt(req.query?.page || '1', 10));
    const perPage = Math.max(1, parseInt(req.query?.perPage || '20', 10));
    const skip = (page - 1) * perPage;

    const data = await query.skip(skip).limit(perPage);

    const total = await baseQuery.countDocuments();

    const meta = {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage)
    };

    return [
        data,
        meta
    ];
}

export default applyPaginate;