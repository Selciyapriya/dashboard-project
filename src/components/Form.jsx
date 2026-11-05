const Form = ({
  onSubmit,
  onCancel,
  saving,
  submitText,
  children,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}

      <div className="flex gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-violet-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
};

export default Form;