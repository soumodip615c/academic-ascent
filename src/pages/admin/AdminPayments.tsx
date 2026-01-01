import { CreditCard, CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const payments = [
  { id: 1, student: "Rahul Kumar", amount: 5000, date: "Dec 25, 2024", transactionId: "TXN123456", status: "pending" },
  { id: 2, student: "Priya Singh", amount: 10000, date: "Dec 24, 2024", transactionId: "TXN123457", status: "verified" },
  { id: 3, student: "Amit Sharma", amount: 7500, date: "Dec 23, 2024", transactionId: "TXN123458", status: "verified" },
  { id: 4, student: "Sneha Das", amount: 5000, date: "Dec 22, 2024", transactionId: "TXN123459", status: "rejected" },
];

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
  const pendingPayments = payments.filter((p) => p.status === "pending");
  const totalVerified = payments
    .filter((p) => p.status === "verified")
    .reduce((acc, p) => acc + p.amount, 0);

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
          <p className="text-sm text-muted-foreground mb-1">Total Verified (This Month)</p>
          <p className="text-2xl font-bold text-education-green">₹{totalVerified.toLocaleString()}</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Student</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground hidden md:table-cell">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground hidden lg:table-cell">Transaction ID</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr 
                  key={payment.id}
                  className={index !== payments.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="px-6 py-4 font-medium text-foreground">
                    {payment.student}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm hidden lg:table-cell">
                    {payment.transactionId}
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
                          <Button size="sm" className="bg-success hover:bg-success/90">
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
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
    </div>
  );
};

export default AdminPayments;
