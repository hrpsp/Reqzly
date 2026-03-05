import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  CreditCard,
  Save,
  Loader2,
} from 'lucide-react';

import { Button, Input, Select, Textarea, FormField, Card, CardContent, CardHeader, CardFooter } from '@/components/ui';
import { creditCardRequestsApi } from '@/api/creditCardRequests';
import { CREDIT_CARD_REQUEST_TYPE_OPTIONS } from '@/types/creditCard';
import type { CreditCardRequestFormData } from '@/types/creditCard';

// ─── Zod schema ────────────────────────────────────────────────────────────────
const schema = z
  .object({
    customer_name: z
      .string()
      .min(1, 'Customer name is required')
      .max(255, 'Name must be 255 characters or less'),

    customer_cnic: z
      .string()
      .regex(/^\d{13}$/, 'CNIC must be exactly 13 digits (no dashes)'),

    credit_card_number: z
      .string()
      .min(1, 'Credit card number is required')
      .max(50, 'Card number too long'),

    contact_no: z
      .string()
      .min(1, 'Contact number is required')
      .max(20, 'Contact number too long'),

    email: z
      .string()
      .email('Enter a valid email address')
      .or(z.literal(''))
      .optional(),

    request_type: z.string().min(1, 'Please select a request type'),

    other_request_details: z.string().max(1000).optional(),

    details: z.string().max(5000).optional(),

    branch_id: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.request_type === 'other' && !data.other_request_details?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['other_request_details'],
        message: 'Please describe your request when selecting "Other"',
      });
    }
  });

type FormValues = z.infer<typeof schema>;

// ─── Component ─────────────────────────────────────────────────────────────────
interface CreditCardRequestFormProps {
  mode?: 'create' | 'edit';
}

export default function CreditCardRequestForm({ mode = 'create' }: CreditCardRequestFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEdit = mode === 'edit' && !!id;

  // ─── Load existing record when editing ─────────────────────────────────────
  const { data: existingData, isLoading: isLoadingRecord } = useQuery({
    queryKey: ['credit-card-request', id],
    queryFn: async () => {
      const res = await creditCardRequestsApi.get(Number(id));
      return res.data;
    },
    enabled: isEdit,
  });

  // ─── Form setup ────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_name: '',
      customer_cnic: '',
      credit_card_number: '',
      contact_no: '',
      email: '',
      request_type: '',
      other_request_details: '',
      details: '',
      branch_id: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (existingData) {
      reset({
        customer_name: existingData.customer_name,
        customer_cnic: existingData.customer_cnic,
        credit_card_number: existingData.credit_card_number,
        contact_no: existingData.contact_no,
        email: existingData.email ?? '',
        request_type: existingData.request_type,
        other_request_details: existingData.other_request_details ?? '',
        details: existingData.details ?? '',
        branch_id: existingData.branch_id?.toString() ?? '',
      });
    }
  }, [existingData, reset]);

  const watchedRequestType = watch('request_type');
  const showOtherDetails = watchedRequestType === 'other';

  // ─── Mutations ─────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: CreditCardRequestFormData) => creditCardRequestsApi.create(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['credit-card-requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(`Request ${res.data.request_number} created successfully`);
      navigate('/credit-card/list');
    },
    onError: () => {
      toast.error('Failed to create request. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreditCardRequestFormData>) =>
      creditCardRequestsApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-card-requests'] });
      queryClient.invalidateQueries({ queryKey: ['credit-card-request', id] });
      toast.success('Request updated successfully');
      navigate('/credit-card/list');
    },
    onError: () => {
      toast.error('Failed to update request. Please try again.');
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending || isSubmitting;

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      email: values.email || undefined,
      other_request_details: values.other_request_details || undefined,
      details: values.details || undefined,
      branch_id: values.branch_id || undefined,
    } as CreditCardRequestFormData;

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  // ─── Loading skeleton while fetching edit record ────────────────────────────
  if (isEdit && isLoadingRecord) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0D5C73]" />
      </div>
    );
  }

  const requestTypeOptions = [
    ...CREDIT_CARD_REQUEST_TYPE_OPTIONS,
  ] as { value: string; label: string }[];

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0D5C73]">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Edit Credit Card Request' : 'New Credit Card Request'}
            </h1>
            <p className="text-sm text-gray-500">
              {isEdit
                ? `Editing: ${existingData?.request_number ?? ''}`
                : 'Fill in the customer details below'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ── Section 1: Customer Information ─────────────────────────────── */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-base font-semibold text-gray-900">Customer Information</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Enter the customer's personal and contact details.
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {/* Customer Name */}
              <FormField
                label="Customer Name"
                htmlFor="customer_name"
                required
                error={errors.customer_name?.message}
              >
                <Input
                  id="customer_name"
                  placeholder="Muhammad Ali Khan"
                  error={errors.customer_name?.message}
                  {...register('customer_name')}
                />
              </FormField>

              {/* CNIC */}
              <FormField
                label="CNIC"
                htmlFor="customer_cnic"
                required
                hint="13 digits without dashes"
                error={errors.customer_cnic?.message}
              >
                <Input
                  id="customer_cnic"
                  placeholder="3520112345678"
                  maxLength={13}
                  error={errors.customer_cnic?.message}
                  {...register('customer_cnic')}
                />
              </FormField>

              {/* Credit Card Number */}
              <FormField
                label="Credit Card Number"
                htmlFor="credit_card_number"
                required
                error={errors.credit_card_number?.message}
              >
                <Input
                  id="credit_card_number"
                  placeholder="4111 1111 1111 1111"
                  error={errors.credit_card_number?.message}
                  {...register('credit_card_number')}
                />
              </FormField>

              {/* Contact No */}
              <FormField
                label="Contact Number"
                htmlFor="contact_no"
                required
                error={errors.contact_no?.message}
              >
                <Input
                  id="contact_no"
                  type="tel"
                  placeholder="03001234567"
                  error={errors.contact_no?.message}
                  {...register('contact_no')}
                />
              </FormField>

              {/* Email */}
              <FormField
                label="Email Address"
                htmlFor="email"
                hint="Optional"
                error={errors.email?.message}
                className="sm:col-span-2"
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* ── Section 2: Request Details ───────────────────────────────────── */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-base font-semibold text-gray-900">Request Details</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Specify the type of service being requested.
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {/* Request Type */}
              <FormField
                label="Request Type"
                htmlFor="request_type"
                required
                error={errors.request_type?.message}
                className="sm:col-span-2"
              >
                <Select
                  id="request_type"
                  placeholder="— Select a request type —"
                  options={requestTypeOptions}
                  error={errors.request_type?.message}
                  {...register('request_type')}
                />
              </FormField>

              {/* Other Request Details (conditional) */}
              {showOtherDetails && (
                <FormField
                  label="Other Request Details"
                  htmlFor="other_request_details"
                  required
                  error={errors.other_request_details?.message}
                  className="sm:col-span-2"
                >
                  <Input
                    id="other_request_details"
                    placeholder="Please describe the request..."
                    error={errors.other_request_details?.message}
                    {...register('other_request_details')}
                  />
                </FormField>
              )}

              {/* Details / Notes */}
              <FormField
                label="Additional Details"
                htmlFor="details"
                hint="Any supporting information or notes"
                error={errors.details?.message}
                className="sm:col-span-2"
              >
                <Textarea
                  id="details"
                  placeholder="Enter any additional details, comments, or supporting information..."
                  rows={4}
                  error={errors.details?.message}
                  {...register('details')}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* ── Form actions ──────────────────────────────────────────────────── */}
        <Card>
          <CardFooter className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </p>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSaving} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? 'Save Changes' : 'Submit Request'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
