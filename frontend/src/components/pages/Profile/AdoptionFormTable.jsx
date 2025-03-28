/* eslint-disable react/prop-types */
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "../../ui/button";
import PeriodicCheckModal from "./PeriodicCheckModal";
import PetAdoptionInfoModal from "./PetAdoptionInfoModal";

const AdoptionFormTable = ({
  data,
  onPageChange,
  currentUser,
  onCheckSubmit,
}) => {
  // State cho modal kiểm tra định kỳ
  const [selectedCheckForm, setSelectedCheckForm] = useState(null);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  const handleViewClick = (form) => {
    setSelectedForm(form);
    setViewModalOpen(true);
  };

  // Hàm kiểm tra xem form có cần check ngay không
  const isCheckOverdue = (form) => {
    if (!form.next_check_date || form.status !== "Approved") return false;
    const now = new Date();
    const nextCheckDate = new Date(form.next_check_date);
    // Kiểm tra nếu đã đến hoặc quá hạn và số lần kiểm tra chưa đạt tối đa (giả sử tối đa là 3)
    return (
      now >= nextCheckDate &&
      (!form.periodicChecks || form.periodicChecks.length < 3)
    );
  };

  const columns = [
    {
      accessorKey: "pet.name",
      header: "Tên thú cưng",
      cell: (info) => info.getValue() || "N/A",
    },
    {
      accessorKey: "adoptionPost._id",
      header: "Bài đăng",
      cell: (info) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`/adoptDetail/${info.getValue()}`, "_blank");
          }}
        >
          Xem bài viết
        </Button>
      ),
    },
    {
      accessorKey: "adopter.name",
      header: "Người nhận nuôi",
      cell: (info) => info.getValue() || "N/A",
    },
    {
      accessorKey: "adopter.email",
      header: "Email",
      cell: (info) => info.getValue() || "N/A",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            info.getValue() === "Approved"
              ? "bg-green-100 text-green-800"
              : info.getValue() === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày gửi",
      cell: (info) => format(new Date(info.getValue()), "dd/MM/yyyy HH:mm:ss"),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: (info) => {
        const form = info.row.original;
        const overdue = isCheckOverdue(form);

        return (
          <div className="flex items-center gap-2">
            {form.status === "Approved" && (
              <Button
                variant={overdue ? "destructive" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCheckForm(form);
                  setIsCheckModalOpen(true);
                }}
                className={overdue ? "animate-pulse" : ""}
              >
                {overdue ? "Check ngay!" : "Check định kỳ"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewClick(form)}
            >
              Xem
            </Button>
            {form.status === "Rejected" && (
              <div className="text-sm text-gray-600">
                <strong>Ghi chú:</strong> {form.response_note || "Không có"}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleCheckSubmit = async () => {
    await onCheckSubmit();
    setIsCheckModalOpen(false);
  };

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

      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>
          Trang {data.page} / {data.totalPages} (Tổng: {data.totalResults} form)
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

      {selectedCheckForm && (
        <PeriodicCheckModal
          open={isCheckModalOpen}
          setOpen={setIsCheckModalOpen}
          form={selectedCheckForm}
          onSubmit={handleCheckSubmit}
          currentUser={currentUser}
        />
      )}

      {viewModalOpen && (
        <PetAdoptionInfoModal
          open={viewModalOpen}
          setOpen={setViewModalOpen}
          form={selectedForm}
        />
      )}
    </div>
  );
};

export default AdoptionFormTable;
