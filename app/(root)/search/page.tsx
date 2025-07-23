import ProductCard from '@/components/shared/product/product-card';
import { getAllProducts, getAllCategories } from '@/lib/actions/product.actions';
import Link from 'next/link';
import SortDropdown from '@/components/sortDropdown';

const prices = [
    { name: '$1 to $50', value: '1-50' },
    { name: '$51 to $100', value: '51-100' },
    { name: '$101 to $200', value: '101-200' },
    { name: '$201 to $500', value: '201-500' },
    { name: '$501 to $1000', value: '501-1000' },
];

const ratings = [4, 3, 2, 1];

const SearchPage = async ({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        category?: string;
        price?: string;
        rating?: string;
        sort?: string;
        page?: string;
    }>;
}) => {
    const resolvedParams = await searchParams;

    const {
        q = 'all',
        category = 'all',
        price = 'all',
        rating = 'all',
        sort = 'newest',
        page = '1',
    } = resolvedParams;

    const getFilter = ({
        c,
        p,
        r,
        s,
        pg,
    }: {
        c?: string;
        p?: string;
        r?: string;
        s?: string;
        pg?: string;
    }) => {
        const params = { q, category, price, rating, sort, page };

        if (c) params.category = c;
        if (p) params.price = p;
        if (s) params.sort = s;
        if (r) params.rating = r;
        if (pg) params.page = pg;

        return `/search?${new URLSearchParams(params).toString()}`;
    };

    // ✅ Fix: Create sortUrls to pass to client instead of getFilter
    const baseParams = { q, category, price, rating, page };

    const sortUrls: Record<string, string> = {
        newest: `/search?${new URLSearchParams({ ...baseParams, sort: 'newest' })}`,
        'createdAt-asc': `/search?${new URLSearchParams({ ...baseParams, sort: 'createdAt-asc' })}`,
        'price-asc': `/search?${new URLSearchParams({ ...baseParams, sort: 'price-asc' })}`,
        'price-desc': `/search?${new URLSearchParams({ ...baseParams, sort: 'price-desc' })}`,
        'rating-desc': `/search?${new URLSearchParams({ ...baseParams, sort: 'rating-desc' })}`,
        'rating-asc': `/search?${new URLSearchParams({ ...baseParams, sort: 'rating-asc' })}`,
    };

    const products = await getAllProducts({
        query: q,
        category,
        price,
        rating,
        sort,
        page: Number(page),
    });

    const categories = await getAllCategories();

    const hasFilters =
        (q && q !== 'all') ||
        (category && category !== 'all') ||
        (price && price !== 'all') ||
        (rating && rating !== 'all');

    return (
        <>
            <div className='grid md:grid-cols-5 gap-6'>
                {/* Sidebar */}
                <aside className='bg-white p-4 rounded-xl shadow-md space-y-6 top-4 h-fit mt-[50px]'>
                    <div>
                        <h3 className='text-lg font-semibold mb-2'>Category</h3>
                        <ul className='space-y-1'>
                            <li>
                                <Link
                                    className={`block hover:text-primary transition ${category === 'all' ? 'font-bold text-primary' : ''}`}
                                    href={getFilter({ c: 'all' })}
                                >
                                    Any
                                </Link>
                            </li>
                            {categories.map((x) => (
                                <li key={x.category}>
                                    <Link
                                        className={`block hover:text-primary transition ${category === x.category ? 'font-bold text-primary' : ''}`}
                                        href={getFilter({ c: x.category })}
                                    >
                                        {x.category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className='text-lg font-semibold mb-2'>Price</h3>
                        <ul className='space-y-1'>
                            <li>
                                <Link
                                    className={`block hover:text-primary transition ${price === 'all' ? 'font-bold text-primary' : ''}`}
                                    href={getFilter({ p: 'all' })}
                                >
                                    Any
                                </Link>
                            </li>
                            {prices.map((x) => (
                                <li key={x.value}>
                                    <Link
                                        className={`block hover:text-primary transition ${price === x.value ? 'font-bold text-primary' : ''}`}
                                        href={getFilter({ p: x.value })}
                                    >
                                        {x.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className='text-lg font-semibold mb-2'>Customer Ratings</h3>
                        <ul className='space-y-1'>
                            <li>
                                <Link
                                    className={`block hover:text-primary transition ${rating === 'all' ? 'font-bold text-primary' : ''}`}
                                    href={getFilter({ r: 'all' })}
                                >
                                    Any
                                </Link>
                            </li>
                            {ratings.map((r) => (
                                <li key={r}>
                                    <Link
                                        className={`block hover:text-primary transition ${rating === r.toString() ? 'font-bold text-primary' : ''}`}
                                        href={getFilter({ r: `${r}` })}
                                    >
                                        {r} stars & up
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>


                {/* Products Section */}
                <section className='md:col-span-4 space-y-6'>
                    {/* Filter Badges */}
                    {hasFilters && (
                        <div className='flex flex-wrap gap-2 items-center'>
                            {q !== 'all' && q !== '' && (
                                <span className='bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full'>
                                    Query: {q}
                                </span>
                            )}
                            {category !== 'all' && category !== '' && (
                                <span className='bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full'>
                                    Category: {category}
                                </span>
                            )}
                            {price !== 'all' && (
                                <span className='bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full'>
                                    Price: {price}
                                </span>
                            )}
                            {rating !== 'all' && (
                                <span className='bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full'>
                                    Rating: {rating} & up
                                </span>
                            )}
                            <Link href='/search' className='text-sm text-red-600 hover:underline ml-2'>
                                Clear All
                            </Link>
                        </div>
                    )}

                    {/* Sort Dropdown */}
                    <SortDropdown sort={sort} sortUrls={sortUrls} />


                    {/* Product Grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {products.data.length === 0 ? (
                            <div className='col-span-full text-center text-gray-500 py-10'>
                                No Products Found 🛒
                            </div>
                        ) : (
                            products.data.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={JSON.parse(JSON.stringify(product))}
                                />
                            ))
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default SearchPage;
