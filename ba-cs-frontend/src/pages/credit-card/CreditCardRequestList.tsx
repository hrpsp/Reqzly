import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Filter,
  X,
} from 'lucide-react';

import {
  Button,
  Badge,
  SearchInput,
  Pagination,
  DateRangePicker,
  DataTable,
  Select,
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui';
import type { Column } from '@/components/ui';

import { creditCardRequestsApi } from '@/api/creditCardRequests';
import { CREDIT_CARD_REQUEST_TYPE_OPTIONS } from '@/types/creditCard';
import type { CreditCardRequest, CreditCardRequestFilters } from '@/types/creditCard';
import type { RequestStatus } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';
import type { BadgeVariant } from '@/components/ui/Badge';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<RequestStatus, { variant: BadgeVariant; label: string }> = {
  pending:   { variant: 'yellow', label: 'Pending' },
  verified:  { variant: 'blue',   label: 'Verified' },
  completed: { variant: 'green',  label: 'Completed' },
  cancelled: { variant: 'red',    label: 'Cancelled' },
};

const STATUS_OPTIONS = [
  { value: '',          label: 'All Statuses' },
  { value: 'pending',   label: 'Pending' },
  { value: 'verified',  label: 'Verified' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  ...CREDIT_CARD_REQUEST_TYPE_OPTIONS,
] as { value: string; label: string }[];

const PER_PAGE_OPTIONS = [
  { value: '10', label: '10 / page' },
  { value: '15', label: '15 / page' },
  { value: '25', label: '25 / page' },
  { value: '50', label: '50 / page' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CreditCardRequestList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';

  // ─── Filter state ──────────────────────────────────────────────────────────
  const [search, setSearch]         = useState('');
  const [status, setStatus]         = useState<string>('');
  const [requestType, setReqType]   = useState('');
  const [startDate, setStartDate]   = useState<Date | null>(null);
  const [endDate, setEndDate]       = useState<Date | null>(null);
  const [page, setPage]             = useState(1);
  const [perPage, setPerPage]       = useState(15);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    !!search || !!status || !!requestType || !!startDate || !!endDate;

  const clearFilters = useCallback(() => {
    setSearch('');
    setStatus('');
    setReqType('');
    setStartDate(null);
    setEndDate(null);
    setPage(1);
  }, []);

  // Format dates to YYYY-MM-DD for API
  const fmtDate = (d: Date | null) =>
    d ? d.toISOString().slice(0, 10) : undefined;

  const filters: CreditCardRequestFilters = {
    search:       search || undefined,
    status:       (status as RequestStatus) || undefined,
    request_type: (requestType as CreditCardRequestFilters['request_type']) || undefined,
    date_from:    fmtDate(startDate),
    date_to:      fmtDate(endDate),
    page,
    per_page:     perPage,
  };

  // ─── Data fetch ────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['credit-card-requests', filters],
    queryFn: async () => {
      const res = await creditCardRequestsApi.list(filters);
      return res.data;
    },
    placeholderData: (prev) => prev,
  });

  const requests = data?.data ?? [];
  const meta     = data?.meta;

  // ─── Delete mutation ───────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: number) => creditCardRequestsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-card-requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Request deleted successfully');
    },
    onError: () => toast.error('Failed to delete request'),
  });

  const handleDelete = (req: CreditCardRequest) => {
    if (!window.confirm(`Delete request ${req.request_number}? This cannot be undone.`)) return;
    deleteMutation.mutate(req.id);
  };

  // ─── Export ────────────────────────────────────────────────────────────────
  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async () => {
    try {
      setIsExporting(true);
      await creditCardRequestsApi.export(filters);
      toast.success('Export downloaded');
    } catch {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // ─── Table columns ─────────────────────────────────────────────────────────
  const columns: Column<CreditCardRequest>[] = [
    {
      key: 'request_number',
      header: 'Request #',
      render: (row) => (
        <button
          type="button"
          onClick={() => navigate(`/credit-card/${row.id}`)}
          className="font-mono text-xs font-semibold text-[#0D5C73] hover:underline"
        >
          {row.request_number}
        </button>
      ),
    },
    {
      key: 'customer_name',
      header: 'Customer',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.customer_name}</p>
          <p className="text-xs text-gray-500">{row.customer_cnic}</p>
        </div>
      ),
    },
    {
      key: 'request_type',
      header: 'Request Type',
      render: (row) => (
        <span className="text-gray-700">{row.request_type_label}</span>
      ),
      className: 'max-w-[180px] truncate',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const cfg = STATUS_BADGE[row.status] ?? { variant: 'gray', label: row.status };
        return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>;
      },
    },
    {
      key: 'biometric',
      header: 'Biometric',
      render: (row) =>
        row.biometric_verified ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
            <ShieldCheck className="h-4 w-4" />
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600">
            <ShieldAlert className="h-4 w-4" />
            Pending
          </span>
        ),
    },
    {
      key: 'branch',
      header: 'Branch',
      render: (row) => (
        <span className="text-gray-600">{row.branch?.branch_name ?? '—'}</span>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (row) => (
        <div>
          <p className="text-gray-700">
            {new Date(row.created_at).toLocaleDateString('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
          </p>
          <p className="text-xs text-gray-400">{row.created_at_human}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          {/* View */}
          <button
            type="button"
            onClick={() => navigate(`/credit-card/${row.id}`)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#0D5C73] transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>

          {/* Edit — only if not completed/cancelled */}
          {row.status !== 'completed' && row.status !== 'cancelled' && (
            <button
              type="button"
              onClick={() => navigate(`/credit-card/${row.id}/edit`)}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-amber-600 transition-colors"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}

          {/* Delete — admin only */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => handleDelete(row)}
              disabled={deleteMutation.isPending}
              className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Credit Card Requests</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {meta ? `${meta.total} total requests` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleExport}
            isLoading={isExporting}
            disabled={isExporting}
            size="sm"
          >
            <Download className="mr-1.5 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => navigate('/credit-card/new')} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Search & filter bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <SearchInput
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search by name, CNIC or request #"
              className="min-w-[220px] flex-1"
            />

            {/* Toggle advanced filters */}
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-1.5 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#0D5C73]">
                  !
                </span>
              )}
            </Button>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}

            {/* Per-page */}
            <Select
              options={PER_PAGE_OPTIONS}
              value={perPage.toString()}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="w-[120px]"
            />
          </div>

          {/* Advanced filters (collapsible) */}
          {showFilters && (
            <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Status */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
                <Select
                  options={STATUS_OPTIONS}
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                />
              </div>

              {/* Request Type */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Request Type</label>
                <Select
                  options={TYPE_OPTIONS}
                  value={requestType}
                  onChange={(e) => { setReqType(e.target.value); setPage(1); }}
                />
              </div>

              {/* Date range — spans 2 cols on lg */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="mb-1 block text-xs font-medium text-gray-600">Date Range</label>
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onStartChange={(d) => { setStartDate(d); setPage(1); }}
                  onEndChange={(d) => { setEndDate(d); setPage(1); }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data table */}
      <Card>
        <DataTable
          columns={columns}
          data={requests}
          isLoading={isLoading || isFetching}
          emptyMessage="No credit card requests found."
          keyExtractor={(row) => row.id}
        />

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <CardFooter>
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              total={meta.total}
              perPage={meta.per_page}
              from={meta.from}
              to={meta.to}
              onPageChange={setPage}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
