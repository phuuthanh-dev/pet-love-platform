/* eslint-disable react/prop-types */
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { format } from "date-fns";

const SubmittedPetTable = ({ data, onPageChange }) => {
  // Định nghĩa các cột
  const columns = [
    {
      accessorKey: "name",
      header: "Tên",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "breed.name",
      header: "Giống",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "age",
      header: "Tuổi",
      cell: (info) => `${info.getValue()} tuổi`,
    },
    {
      accessorKey: "health_status",
      header: "Tình trạng sức khỏe",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: (info) => info.getValue() || "Không có",
    },
    {
      accessorKey: "image_url",
      header: "Hình ảnh",
      cell: (info) => (
        <img
          src={info.getValue()[0][0]}
          alt="Pet"
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "isApproved",
      header: "Đã phê duyệt",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            info.getValue()
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {info.getValue() ? "Có" : "Không"}
        </span>
      ),
    },
    {
      accessorKey: "isAdopted",
      header: "Đã nhận nuôi",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            info.getValue()
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {info.getValue() ? "Có" : "Không"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày gửi",
      cell: (info) => format(new Date(info.getValue()), "dd/MM/yyyy HH:mm:ss"),
    },
  ];

  // Khởi tạo bảng
  const table = useReactTable({
    data: data.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 transition-colors border-b"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-sm text-gray-600">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>
          Trang {data.page} / {data.totalPages} (Tổng: {data.totalResults} thú
          cưng)
        </div>
        <div className="space-x-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            disabled={data.page === 1}
            onClick={() => onPageChange(data.page - 1)}
          >
            Trước
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            disabled={data.page === data.totalPages}
            onClick={() => onPageChange(data.page + 1)}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmittedPetTable;
