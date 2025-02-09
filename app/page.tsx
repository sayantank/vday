"use client";
import { useActionState } from "react";
import { saveValentine } from "./actions";
import Link from "next/link";

export default function Home() {
  const [state, formAction] = useActionState(saveValentine, null);

  return (
    <main className="min-h-dvh p-8 bg-pink-50">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-semibold text-pink-600 mb-8 text-center">
          make your valentine card
        </h1>

        <form
          action={formAction}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="slug"
              className="block text-pink-700 font-semibold mb-2"
            >
              name your card
            </label>
            <input
              type="text"
              name="slug"
              id="slug"
              required
              maxLength={16}
              pattern="[a-z0-9-]+"
              title="Only lowercase letters, numbers, and hyphens allowed"
              className="w-full p-2 border border-pink-200 bg-white shadow-sm font-semibold text-pink-700"
            />
          </div>

          <div>
            <label
              htmlFor="to"
              className="block text-pink-700 font-semibold mb-2"
            >
              to
            </label>
            <input
              type="text"
              name="to"
              id="to"
              required
              maxLength={50}
              className="w-full p-2 border border-pink-200 bg-white shadow-sm font-semibold text-pink-700"
            />
          </div>

          <div>
            <label
              htmlFor="from"
              className="block text-pink-700 font-semibold mb-2"
            >
              from
            </label>
            <input
              type="text"
              name="from"
              id="from"
              required
              maxLength={50}
              className="w-full p-2 border border-pink-200 bg-white shadow-sm font-semibold text-pink-700"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-pink-700 font-semibold mb-2"
            >
              message
            </label>
            <textarea
              name="message"
              id="message"
              required
              maxLength={500}
              rows={4}
              className="w-full p-2 border border-pink-200 bg-white shadow-sm font-semibold text-pink-700"
            />
          </div>

          {state?.error && <p className="text-red-500 text-sm font-semibold">{state.error}</p>}
          {state?.success && (
            <div className="space-y-2">
              <p className="text-pink-700 font-semibold">here's your valentine's card</p>
              <div className="flex items-center gap-2 p-4 bg-white border border-pink-200 shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/${state.slug}`}
                  className="flex-1 p-2 bg-pink-50 font-semibold text-pink-700"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(`${window.location.origin}/${state.slug}`)
                  }
                  className="px-4 py-2 bg-pink-500 text-white font-semibold hover:bg-pink-600"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 shadow-lg transition-all hover:bg-pink-600 font-semibold"
          >
            MAKE CARD
          </button>
        </form>
      </div>
      <p className="text-pink-400 text-base font-semibold text-center my-6">
        something by{" "}
        <Link
          href="https://x.com/sayantanxyz"
          target="__blank"
        >
          <span className="font-bold hover:underline">sayantan ㋡</span>
        </Link>
      </p>
    </main>
  );
}
