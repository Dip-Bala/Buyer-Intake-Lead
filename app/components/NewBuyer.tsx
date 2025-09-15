"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  CityEnum,
  PropertyTypeEnum,
  BHKEnum,
  PurposeEnum,
  TimelineEnum,
  SourceEnum,
  createBuyerSchema,
  CreateBuyerInput,
} from "@/lib/validators/buyers";

export default function NewBuyer() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateBuyerInput>({
    resolver: zodResolver(createBuyerSchema),
  });

  const propertyType = watch("propertyType");

  const onSubmit: SubmitHandler<CreateBuyerInput> = async (data) => {
    try {
      await axios.post("/api/buyers", data, { withCredentials: true });
      router.push("/buyers");
    } catch (e: any) {
      alert(e.message || "Network error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto p-4 space-y-4"
    >
      <div>
        <label className="block">Full name</label>
        <input {...register("fullName")} className="border p-2 w-full" />
        {errors.fullName && (
          <p className="text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label>Email (optional)</label>
        <input {...register("email")} className="border p-2 w-full" />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label>Phone</label>
        <input {...register("phone")} className="border p-2 w-full" />
        {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}
      </div>

      <div>
        <label>City</label>
        <select {...register("city")} className="border p-2 w-full">
          {CityEnum.options.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Property Type</label>
        <select {...register("propertyType")} className="border p-2 w-full">
          {PropertyTypeEnum.options.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {propertyType === "Apartment" || propertyType === "Villa" ? (
        <div>
          <label>BHK</label>
          <select {...register("bhk")} className="border p-2 w-full">
            <option value="">Select</option>
            {BHKEnum.options.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {errors.bhk && <p className="text-red-600">{errors.bhk.message}</p>}
        </div>
      ) : null}

      <div>
        <label>Purpose</label>
        <select {...register("purpose")} className="border p-2 w-full">
          {PurposeEnum.options.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label>Budget Min</label>
          <input {...register("budgetMin")} className="border p-2 w-full" />
          {errors.budgetMin && (
            <p className="text-red-600">{errors.budgetMin.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label>Budget Max</label>
          <input {...register("budgetMax")} className="border p-2 w-full" />
          {errors.budgetMax && (
            <p className="text-red-600">{errors.budgetMax.message}</p>
          )}
        </div>
      </div>

      <div>
        <label>Timeline</label>
        <select {...register("timeline")} className="border p-2 w-full">
          {TimelineEnum.options.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Source</label>
        <select {...register("source")} className="border p-2 w-full">
          {SourceEnum.options.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Notes</label>
        <textarea {...register("notes")} className="border p-2 w-full" />
      </div>

      <div>
        <label>Tags (comma separated)</label>
        <input
          {...register("tags")}
          className="border p-2 w-full"
          placeholder="e.g. verified, interested"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Saving..." : "Save Lead"}
      </button>
    </form>
  );
}
