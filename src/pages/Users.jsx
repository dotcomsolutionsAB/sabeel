import { useEffect, useMemo, useState } from "react";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { EditIcon, TrashIcon } from "../components/icons";
import { retrieveUsersApi } from "../services/userService";
import AddUserModal from "../components/modals/AddUserModal";
import EditUserModal from "../components/modals/EditUserModal";


function toStr(v) {
    return v == null ? "" : String(v);
}

export default function Users() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    // ✅ Only one filter: search (username or name)
    const [search, setSearch] = useState("");
    const [addOpen, setAddOpen] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    // pagination
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const [pagination, setPagination] = useState({
        limit: pageSize,
        offset: 0,
        count: 0,
        total: 0,
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setApiError("");

            const res = await retrieveUsersApi({
                limit: pageSize,
                offset,
                search: search?.trim() || "",
                // role is optional (API supports), but you asked only one filter.
                // role: "user",
            });

            const json = Array.isArray(res) ? { data: res } : res;

            const apiRows = Array.isArray(json?.data) ? json.data : [];
            setRows(apiRows.map((r) => ({ ...r, id: String(r.id) })));

            setPagination({
                limit: json?.pagination?.limit ?? pageSize,
                offset: json?.pagination?.offset ?? offset,
                count: json?.pagination?.count ?? apiRows.length,
                total: json?.pagination?.total ?? apiRows.length,
            });

        } catch (e) {
            setApiError(e?.message || "Failed to fetch users");
            setRows([]);
            setPagination({ limit: pageSize, offset, count: 0, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    // fetch on mount + page changes
    useEffect(() => {
        const t = setTimeout(() => {
            fetchUsers();
        }, 400);

        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, search]);

    const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / pageSize));

    const columns = useMemo(
        () => [
            {
                key: "sn",
                header: "SN No.",
                width: 60,
                render: (r) => (
                    <div className="text-xs text-slate-700">
                        {Number(pagination.offset || 0) + (rows.findIndex((x) => x.id === r.id) + 1)}
                    </div>
                ),
            },
            {
                key: "name",
                header: "Name",
                width: 160,
                render: (r) => (
                    <div className="text-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1">{r?.name || "-"}</div>
                        <div className="text-slate-500">ID: {r?.id || "-"}</div>
                    </div>
                ),
            },
            {
                key: "username",
                header: "Username",
                width: 160,
                render: (r) => <div className="text-xs text-slate-700">{r?.username || "-"}</div>,
            },
            {
                key: "email",
                header: "Email",
                width: 200,
                render: (r) => <div className="text-xs text-slate-700">{r?.email || "-"}</div>,
            },
            {
                key: "role",
                header: "User Type",
                width: 120,
                render: (r) => {
                    const role = toStr(r?.role).toLowerCase();
                    const isAdmin = role === "admin";
                    return (
                        <span
                            className={[
                                "inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold",
                                isAdmin ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700",
                            ].join(" ")}
                        >
                            {isAdmin ? "Admin" : "User"}
                        </span>
                    );
                },
            },
            {
                key: "actions",
                header: "Actions",
                width: 100,
                render: (r) => (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-sky-200 bg-white hover:bg-sky-50 text-sky-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingUser(r);     // ✅ set selected row
                                setEditOpen(true);     // ✅ open modal
                            }}
                            title="Edit"
                        >
                            <EditIcon className="w-5 h-5" />
                        </button>

                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-rose-200 bg-white hover:bg-rose-50 text-rose-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log("DELETE USER", r);
                            }}
                            title="Delete"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pagination.offset, rows]
    );

    return (
        <>
            <div className="px-3 pb-4">
                <div className="rounded-2xl bg-white/70 border border-sky-100 shadow-sm overflow-hidden h-[calc(100vh-110px)] flex flex-col">
                    {/* top header bar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-700 to-sky-500">
                        <div className="text-white font-semibold">Users</div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-lg bg-sky-900/80 hover:bg-sky-900 text-white px-4 py-2 text-xs font-semibold"
                            onClick={() => setAddOpen(true)}
                        >
                            {/* <PlusIcon className="w-4 h-4" /> */}
                            Add New User
                        </button>
                    </div>

                    {apiError ? (
                        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-sm text-red-700">
                            {apiError}
                        </div>
                    ) : null}

                    {/* search row */}
                    <div className="px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-full max-w-sm">
                                <div className="text-xs font-semibold text-slate-700 mb-1">Search</div>
                                <input
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1); // ✅ reset to page 1 whenever you search
                                    }}
                                    placeholder="Search by name or username..."
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* table */}
                    <div className="px-4 pb-4">
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                            {loading ? (
                                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                    <Loader fullScreen={false} text="Loading users..." />
                                </div>
                            ) : null}
                            <DataTable
                                columns={columns}
                                data={rows}
                                rowKey="id"
                                stickyHeader={true}
                                height="100%"
                                footer={
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <Pagination page={page} totalPages={totalPages} onChange={setPage} />

                                        <div className="text-xs text-slate-600">
                                            Total: <span className="font-semibold">{pagination.total || 0}</span>
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            <AddUserModal
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onSave={async (payload) => {
                    // ✅ call your create user API here
                    // await createUserApi(payload);

                    console.log("CREATE USER PAYLOAD", payload);

                    setAddOpen(false);
                    // refresh list after save
                    await fetchUsers();
                }}
            />
            <EditUserModal
                open={editOpen}
                user={editingUser}
                onClose={() => {
                    setEditOpen(false);
                    setEditingUser(null);
                }}
                onUpdate={async (payload) => {
                    // ✅ call your update user API here
                    // await updateUserApi(payload);

                    console.log("UPDATE USER PAYLOAD", payload);

                    setEditOpen(false);
                    setEditingUser(null);

                    // refresh list after update
                    await fetchUsers();
                }}
            />
        </>
    );
}
