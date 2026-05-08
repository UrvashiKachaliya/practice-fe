import React, { useMemo, useState } from "react";
import useUsers from "./hooks/fetchUsers";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaUserFriends } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { FaBuildingColumns } from "react-icons/fa6";

function App() {
  const { data = [], isLoading, isError, error } = useUsers();
  console.log("Fetched users:", data);

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "username",
        header: "Username",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "address.city",
        header: "City",
      },
      {
        accessorFn: (row) => row.company?.name,
        id: "company",
        header: "Company",
      },
      {
        accessorKey: "website",
        header: "Website",
      },
    ],
    [],
  );

  // Table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="card shadow">
          <div className="card-body text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 mb-0 text-muted">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger shadow-sm" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p className="mb-0">{error?.message || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Main Card Container */}
      <div className="card shadow-lg border-0 rounded-3">
        <div className="card-body p-0">
          {/* Header Section */}
          <div className="p-4 border-bottom bg-light rounded-top-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="h3 mb-1 fw-bold text-dark">Users Dashboard</h1>
                <p className="text-muted mb-0">
                  Manage and view all users in one place
                </p>
              </div>

              {/* Global Search */}
              <div className="d-flex align-items-center gap-2">
                <label htmlFor="searchInput" className="text-muted">
                  <i className="bi bi-search"></i>
                </label>
                <input
                  id="searchInput"
                  type="text"
                  placeholder="Search users..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="form-control form-control-sm"
                  style={{ minWidth: "250px" }}
                />
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="px-4 pt-4">
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card bg-primary bg-opacity-10 border-0">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Total Users</h6>
                        <h3 className="mb-0 fw-bold text-primary">
                          {data.length}
                        </h3>
                      </div>
                      <div className="fs-1 text-primary opacity-50">
                        <FaUserFriends />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-success bg-opacity-10 border-0">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Showing</h6>
                        <h3 className="mb-0 fw-bold text-success">
                          {table.getRowModel().rows.length}
                        </h3>
                      </div>
                      <div className="fs-1 text-success opacity-50">
                        <VscGraph />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-info bg-opacity-10 border-0">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Companies</h6>
                        <h3 className="mb-0 fw-bold text-info">
                          {
                            new Set(
                              data.map((u) => u.company?.name).filter(Boolean),
                            ).size
                          }
                        </h3>
                      </div>
                      <div className="fs-1 text-info opacity-50">
                        <FaBuildingColumns />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="px-4 pb-4">
            <div className="table-responsive border rounded-2">
              <table className="table table-striped table-hover table-bordered mb-0 align-middle">
                {/* Table Header */}
                <thead className="table-light">
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                      {hg.headers.map((header) => (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className="text-start fw-semibold user-select-none"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </span>

                            {/* Sorting Indicator */}
                            <span className="text-muted small">
                              {{
                                asc: "↑",
                                desc: "↓",
                              }[header.column.getIsSorted()] ?? "↕"}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                {/* Table Body */}
                <tbody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="text-start">
                            {flexRender(
                              cell.column.columnDef.cell ??
                                cell.column.columnDef.accessorKey,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-5">
                        <div className="text-muted">
                          <i className="bi bi-inbox fs-1"></i>
                          <p className="mb-0 mt-2">No results found</p>
                          {/* <small>Try adjusting your search</small> */}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Section */}
            <div className="mt-3 pt-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="text-muted small">
                <i className="bi bi-info-circle me-1"></i>
                Showing <strong>
                  {table.getRowModel().rows.length}
                </strong> of <strong>{data.length}</strong> users
              </div>

              {globalFilter && (
                <div>
                  <button
                    onClick={() => setGlobalFilter("")}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
