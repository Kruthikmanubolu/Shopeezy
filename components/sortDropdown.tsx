'use client';

type SortDropdownProps = {
    sort: string;
    sortUrls: Record<string, string>;
};

export default function SortDropdown({ sort, sortUrls }: SortDropdownProps) {
    return (
        <select
            value={sort}
            onChange={(e) => {
                const newSort = e.target.value;
                window.location.href = sortUrls[newSort] || sortUrls['newest'];
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
            <option value="newest">Newest</option>
            <option value="createdAt-asc">Oldest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
        </select>
    );
}
