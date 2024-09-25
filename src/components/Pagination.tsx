import React from 'react'

type Props = {
    rowCount: number
    recordFerPage: number
    page: number
    setPage: any
}

const Pagination = ({ rowCount, recordFerPage, page, setPage }: Props) => {
    const selectedPageHandler = (selectedPage: number) => {}

    if (rowCount > 0) {
        return (
            <div className="p-4 flex items-center justify-between text-gray-500">
                <button
                    onClick={() => {
                        setPage(page - 1)
                    }}
                    disabled={page <= 1}
                    className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Prev
                </button>
                <div className="flex items-center gap-2 text-sm">
                    {[...Array(Math.ceil(rowCount / recordFerPage))].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setPage(i + 1)
                            }}
                            className={`px-2 rounded-sm ${page === i + 1 ? 'bg-mrxSky' : ''}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => {
                        setPage(page + 1)
                    }}
                    disabled={page < rowCount / recordFerPage ? false : true}
                    className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        )
    }
}

export default Pagination
