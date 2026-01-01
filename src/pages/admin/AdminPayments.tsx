import { CreditCard, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFees, useUpdateFee } from "@/hooks/useFees";
import { toast } from "sonner";
import { format } from "date-fns";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <span className="status-pending flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Pending
        </span>
      );
    case "verified":
    case "paid":
      return (
        <span className="status-paid flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified
        </span>
      );
    case "rejected":
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-destructive/10 text-destructive flex items-center gap-1">
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </span>
      );
    default:
      return null;
  }
};

const AdminPayments = () => {
  const { data: fees = [], isLoading } = useFees();
  const updateFee = useUpdateFee();

  const pendingPayments = fees.filter((p) => p.status === "pending");
  const totalVerified = fees
    .filter((p) => p.status === "verified" || p.status === "paid")
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const handleApprove = async (id: string) => {
    try {
      await updateFee.mutateAsync({
        id,
        status: "verified",
        verified_at: new Date().toISOString(),
      });
      toast.success("Payment verified successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to verify payment");
    }
  };

  const handleReject = async (id: string) => {
    if (confirm("Are you sure you want to reject this payment?")) {
      try {
        await updateFee.mutateAsync({
          id,
          status: "rejected",
        });
        toast.success("Payment rejected!");
      } catch (error: any) {
        toast.error(error.message || "Failed to reject payment");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="feature-icon-purple">
          <CreditCard className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-foreground font-heading">
          Payment Verification
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="card-education">
          <p className="text-sm text-muted-foreground mb-1">Pending Verification</p>
          <p className="text-2xl font-bold text-education-orange">{pendingPayments.length}</p>
        </div>
        <div className="card-education">
          <p className="text-sm text-muted-foreground mb-1">Total Verified</p>
          <p className="text-2xl font-bold text-education-green">₹{totalVerified.toLocaleString()}</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      )}

      {/* Payments Table */}
      {!isLoading && fees.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Student</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground hidden md:table-cell">Due Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground hidden lg:table-cell">Course</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((payment, index) => (
                  <tr 
                    key={payment.id}
                    className={index !== fees.length - 1 ? "border-b border-border" : ""}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {payment.students?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      ₹{Number(payment.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                      {format(new Date(payment.due_date), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm hidden lg:table-cell">
                      {payment.course}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {getStatusBadge(payment.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        {payment.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-education-green hover:bg-education-green/90"
                              onClick={() => handleApprove(payment.id)}
                              disabled={updateFee.isPending}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(payment.id)}
                              disabled={updateFee.isPending}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && fees.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No payment records found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
